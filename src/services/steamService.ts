import axios from "axios";
import { env } from "../config/env.js";
import { mostPlayedCache, initializeMostPlayedCache } from "../state/cacheManager.js";
import { createKey } from "../util/createKeys.js";
import { isWithinMinutes } from "../util/timeUtil.js";
import { cacheTime } from "../config/setting.js";

export async function getMostPlayedGames(offset: number = 0, limit: number = 0) {
    // パラメタが負数の場合0とみなす
    offset = Math.max(0, offset);
    limit = Math.max(0, limit);

    const key = createKey(offset, limit);

    console.log(`キャッシュ: ${mostPlayedCache.preOffset}`);
    console.log(`キャッシュ: ${mostPlayedCache.preLimit}`);
    console.log(`キャッシュ: ${mostPlayedCache.preFetchTime}`);
    console.log(`キャッシュ: ${mostPlayedCache.key}`);
    console.log(`キャッシュ: ${mostPlayedCache.data}`);

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
            ranks = ranks.slice(offset, offset + limit);
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
async function fetchMostPlayedGames(): Promise<any[]> {

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