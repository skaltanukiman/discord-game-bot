import axios from "axios";
import { env } from "../config/env.js";
import { mostPlayedCache, initializeMostPlayedCache, detailDataCache } from "../state/cacheManager.js";
import { createKey } from "../util/createKeys.js";
import { isWithinMinutes } from "../util/timeUtil.js";
import { cacheTime, mostPlayed } from "../config/setting.js";
import { SteamAppDetailsResponse, MostPlayedGame, ExtendedSteamGameDetail } from "../services/steamTypeManager.js";

/**
 * Steamの同時接続数ランキング上位ゲームの詳細情報を取得する
 * 
 * 処理内容:
 * 1. 同時接続数ランキングを取得
 * 2. ランキングからappid一覧を抽出
 * 3. appidを元に詳細情報を取得
 * 4. ランキング情報と詳細情報をマージして返却
 * 
 * @returns
 * 上位ゲームの詳細情報Map。
 * key: appid
 * value: ExtendedSteamGameDetail
 * 
 * ランキングまたは詳細情報の取得に失敗した場合はnullを返却する
 */
export async function getMostPlayedGameDetails(): Promise<Map<number, ExtendedSteamGameDetail> | null> {
    const ranks = await getMostPlayedGames(mostPlayed.offset, mostPlayed.limit);
    console.log(ranks);

    if (!ranks || ranks.length === 0) {
        console.log("ランキングデータが取得できなかったため、nullを返却します。");
        return null;
    }

    const appids: number[] = ranks.map(x => x.appid);

    const detailData = await getDetailGameDatas(appids);

    if (!detailData || Object.keys(detailData).length === 0) {
        console.log("詳細データが取得できなかったため、nullを返却します。");
        return null;
    }

    // console.log("詳細データ");
    // console.log(detailData);

    return steamDataMarge(appids, ranks, detailData);    
}

/**
 * steamAPIから取得した同時接続数データと詳細データを一つのオブジェクトにマージする
 * 
 * @param appids          データID配列
 * @param mostPlayedDatas 同時接続数データ
 * @param detailData      詳細データ
 * @returns IDをキーとして同時接続数と詳細データをオブジェクトとして持つMap型オブジェクト
 */
export function steamDataMarge(appids: number[], mostPlayedDatas: MostPlayedGame[], detailData:SteamAppDetailsResponse): Map<number, ExtendedSteamGameDetail> {
    const extendedSteamGame = new Map<number, ExtendedSteamGameDetail>();

    for (const appid of appids) {
        const appidStr = String(appid);
        if (!detailData[appidStr]?.success) {
            console.log("successの中にfalseが検知されました。");
            continue;  // 詳細データのsuccessがfalseの場合、次のループへ
        }

        const mostPlayedData = mostPlayedDatas.find(x => x.appid === appid);

        if (!mostPlayedData) continue;

        const extended: ExtendedSteamGameDetail = {steamDetail: detailData[appidStr]["data"]
                                                 , mostplayed: mostPlayedData};

        extendedSteamGame.set(appid, extended);        
    }

    return extendedSteamGame;
}

/**
 * 渡されたappidの詳細データを取得し返却する
 * 
 * @param appids 取得対象の詳細データID配列
 * @returns 詳細データ
 */
export async function getDetailGameDatas(appids: number[]): Promise<SteamAppDetailsResponse> {
    const result: SteamAppDetailsResponse = {};

    for (const appid of appids) {
        const appidStr = String(appid);

        if (isDetailCacheValid(appid)) {
            // appidがキャッシュに存在すればキャッシュから
            // console.log("キャッシュからDetailデータを取得");
            result[appidStr] = getDetailCache(appidStr)!;
        }
        else {
            // 存在しなければAPIから取得
            // console.log("APIからDetailデータを取得");
            const detail = await fetchGameDetail(appid);
            result[appidStr] = detail[appidStr]!;

            setDetailCache(appid, appidStr, detail);
            // console.log(`time: ${detailDataCache.appidWithFetchTime.get(appid)}`)
        }
    }

    return result;
}

/**
 * 詳細データをキャッシュから取得するかの検証を行う
 * 
 * @param appid 検証対象の詳細データID
 * @returns キャッシュから取得する場合True、APIから取得する場合false
 */
function isDetailCacheValid(appid: number): boolean {
    if (!detailDataCache) return false;
    
    if (!detailDataCache.appidWithFetchTime.has(appid)) return false;

    const preFetchTime = detailDataCache.appidWithFetchTime.get(appid);

    if (!preFetchTime) return false;

    // 時刻差異が指定された分数以内の場合、キャッシュから取得
    return isWithinMinutes(preFetchTime, cacheTime.mostPlayed);
}

/**
 * 引数で渡されたIDのキャッシュデータを返却する
 * 
 * @param appidStr 取得するキャッシュデータのID（文字列）
 */
function getDetailCache(appidStr: string) {
    return detailDataCache.data[appidStr];
}

/**
 * キャッシュ関連のデータをセットする。
 * 
 * @param キャッシュするデータ群
 */
function setDetailCache(appid: number, appidStr: string, data: SteamAppDetailsResponse) {
    detailDataCache.appidWithFetchTime.set(appid, Date.now());
    detailDataCache.data[appidStr] = data[appidStr]!;
}

/**
 * appidで指定したIDの詳細データを取得し、返却する
 * 
 * @param appid 詳細データのID
 * @returns IDで指定された詳細データ
 */
async function fetchGameDetail(appid: number): Promise<SteamAppDetailsResponse> {
    const BASE_URL = "https://store.steampowered.com/api/appdetails";
    const LANGUAGE = "japanese"

    try {
        const response = await fetch(`${BASE_URL}?appids=${appid}&l=${LANGUAGE}`);

        if (!response.ok) {
            throw new Error("Steam APIのリクエストに失敗しました。");
        }

        const data: SteamAppDetailsResponse = await response.json();

        // console.log(data);

        return data;
    }
    catch (error) {
        console.error("Steam API処理エラー", error);
        throw error;
    }
}

/**
 * 同時接続数ランキングを取得し、指定条件で抽出した結果を返却する
 * offset と limit が指定されている場合は、該当範囲のデータのみ返却する
 * 
 * @param offset 取得開始位置
 * @param limit 取得件数（0の場合は取得開始位置より後ろを全件取得）
 * @returns 同時接続数ランキングデータ。取得失敗時は空配列
 */
export async function getMostPlayedGames(offset: number = 0, limit: number = 0): Promise<MostPlayedGame[]> {
    // パラメタが負数の場合0とみなす
    offset = Math.max(0, offset);
    limit = Math.max(0, limit);

    const key = createKey(offset, limit);

    // console.log(`キャッシュ: ${mostPlayedCache.preOffset}`);
    // console.log(`キャッシュ: ${mostPlayedCache.preLimit}`);
    // console.log(`キャッシュ: ${mostPlayedCache.preFetchTime}`);
    // console.log(`キャッシュ: ${mostPlayedCache.key}`);
    // console.log(`キャッシュ: ${mostPlayedCache.data}`);

    try {
        if (isCacheValid(key)) {
            console.log("キャッシュからデータを取得します。");
            return mostPlayedCache.data;
        }
        else {
            console.log("APIからデータを取得します。");
        }
    }
    catch (error) {
        console.error("キャッシュ検証中にエラーが起きたため、キャッシュ処理をスキップ。APIよりデータを取得します。");
    }

    try {
        let ranks = await fetchMostPlayedGames();
        const fetchTime = Date.now();

        if (!ranks || !Array.isArray(ranks)) {
            console.error("ランキング取得失敗");
            initializeMostPlayedCache();
            return [];
        }

        if (offset !== 0 || limit !== 0) {
            // 引数で渡されたパラメタにより結果を抽出する
            ranks = limit === 0
                ? ranks.slice(offset)
                : ranks.slice(offset, offset + limit);
        }

        setNewCacheVal(offset, limit, key, fetchTime, ranks);

        return ranks;

    }
    catch (error) {
        console.error("Steam API 取得処理エラー", error);
        initializeMostPlayedCache();
        return [];
    }
}

/**
 * Steam APIから同時接続数ランキングを取得します。
 * 
 * @returns 同時接続数ランキングデータ
 */
async function fetchMostPlayedGames(): Promise<MostPlayedGame[]> {

    const response = await axios.get(
        "https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/",
        {
            params: {
                key: env.steamApiKey
            }
        }
    );
    return response.data?.response?.ranks;
}

function isCacheValid(key: string) {
    if (!mostPlayedCache) return false;
    
    if (mostPlayedCache.key !== key) return false;

    // 時刻差異が指定された分数以内の場合、キャッシュから取得
    return isWithinMinutes(mostPlayedCache.preFetchTime!, cacheTime.mostPlayed);
}

/**
 * キャッシュ関連のデータをセットする。
 * 
 * @param セットするデータ群
 */
function setNewCacheVal(offset: number, limit: number, key: string, fetchTime: number, data: any) {

    if (!mostPlayedCache) {
        console.error(`${mostPlayedCache}が存在しません`);
        return;
    }

    mostPlayedCache.preOffset = offset;
    mostPlayedCache.preLimit = limit;
    mostPlayedCache.preFetchTime = fetchTime;
    mostPlayedCache.key = key;
    mostPlayedCache.data = data;
}