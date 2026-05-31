import { CurrentPlayersData, SteamAppDetailsResponse, SteamStoreApp } from "../services/steamTypeManager.js";
import { isWithinMinutes } from "../util/timeUtil.js";
import { logger } from "../util/logger.js";
import fs from "fs/promises";
import path from "path";
import { encodingString } from "../resource/encoding.js";
import { cacheTime } from "../config/setting.js";

const CACHE_DIR = path.resolve("cache");

export const STEAM_STORE_CACHE_FILE_PATHS = {
    STEAM_GAMES: path.join(CACHE_DIR, "steam-games.json")
} as const;

//#region 型定義

type mostPlayedCacheType = {
    preOffset: number | null;
    preLimit: number | null;
    preFetchTime: number | null;
    key: string | null;  // offset & limit
    data: any;
}

type CacheType<T> = {
    appidWithFetchTime: Map<number, number>;
    data: T;
}

type DetailDataCacheType = CacheType<SteamAppDetailsResponse>;

type CurrentDataCacheType = CacheType<CurrentPlayersData>;

type SteamStoreAppCacheFile = {
    cachedAt: number;
    data: SteamStoreApp[];
};

//#endregion

//#region キャッシュインスタンス

export const currentDataCache: CurrentDataCacheType = {
    appidWithFetchTime: new Map<number, number>(),
    data: {}
};

export const detailDataCache: DetailDataCacheType = {
    appidWithFetchTime: new Map<number, number>(),
    data: {}
};

export const mostPlayedCache: mostPlayedCacheType = {
    preOffset: null,
    preLimit: null,
    preFetchTime: null,
    key: null,
    data: null
};

//#endregion

/**
 * 人気ゲーム一覧キャッシュを初期化する
 * 
 * @remarks
 * 以下のキャッシュ情報を初期状態に戻す:
 * - offset（前回入力条件）
 * - limit（前回入力条件）
 * - キャッシュ取得時刻
 * - キャッシュキー
 * - キャッシュデータ
 */
export function initializeMostPlayedCache () {
    mostPlayedCache.preOffset = null;
    mostPlayedCache.preLimit = null;
    mostPlayedCache.preFetchTime = null;
    mostPlayedCache.key = null;
    mostPlayedCache.data = null;
}

/**
 * 指定した appid のキャッシュが有効期限内か判定する
 * 
 * @param cache キャッシュデータ
 * @param appid Steam アプリID
 * @param limitMinutes キャッシュ有効期限（分）
 * @returns キャッシュが存在し、有効期限内の場合は true
 * 
 * @remarks
 * 以下の場合は false を返す:
 * - キャッシュが存在しない
 * - appid に対応する取得時刻が存在しない
 * - キャッシュ有効期限を超過している
 * - 判定処理中に例外が発生した
 */
export function hasValidCache<T>(cache: CacheType<T>, appid: number, limitMinutes: number): boolean {
    try {
        if (!cache) return false;
        
        if (!cache.appidWithFetchTime.has(appid)) return false;

        const preFetchTime = cache.appidWithFetchTime.get(appid);

        if (preFetchTime == null) return false;

        // 時刻差異が指定された分数以内の場合、キャッシュから取得
        return isWithinMinutes(preFetchTime, limitMinutes);
    }
    catch(error) {
        logger.error(`キャッシュの取得に失敗しました。[${cache}]`, error);
        return false;
    }
}

/**
 * 指定した appid のキャッシュデータを取得する
 * 
 * @param cache キャッシュデータ
 * @param appidStr Steam アプリID文字列
 * @returns appid に対応するキャッシュデータ
 * 
 * @remarks
 * 指定した appid のデータが存在しない場合は undefined を返す。
 */
export function getCacheData<T extends Record<string, any>>(cache: CacheType<T>, appidStr: string) {
    return cache.data[appidStr];
}

/**
 * 指定した appid のキャッシュデータと取得時刻を更新する
 * 
 * @param cache 更新対象のキャッシュデータ
 * @param appid Steam アプリID
 * @param appidStr Steam アプリID文字列
 * @param data キャッシュへ保存するデータ
 * 
 * @remarks
 * - キャッシュ保存時に現在時刻を取得時刻として記録する
 * - 指定した appid のデータが存在しない場合はキャッシュ更新を行わない
 */
export function setCacheData<T>(cache: CacheType<Record<string, T>>, appid: number, appidStr: string, data: Record<string, T>) {
    cache.appidWithFetchTime.set(appid, Date.now());

    if (data[appidStr] == null) {
        logger.error(`キャッシュ値をセットできませんでした。[ID: ${appid}]`);
        return;
    }
    cache.data[appidStr] = data[appidStr];
}

/**
 * Steam Store アプリ一覧のキャッシュをJSONファイルへ保存する
 * 
 * 現在時刻を cachedAt として付与し、指定されたファイルパスへ
 * Steam Storeアプリ一覧データを書き込む。
 * 保存先フォルダが存在しない場合は作成する。
 * 
 * @param filepath キャッシュを書き込むファイルパス
 * @param data キャッシュとして保存するSteam Storeアプリ一覧
 */
export async function saveSteamStoreCache(filepath:string, data: SteamStoreApp[]): Promise<void> {
    const cacheData: SteamStoreAppCacheFile = {
        cachedAt: Date.now(),
        data
    };

    // フォルダがなければ作成
    await fs.mkdir(CACHE_DIR, { recursive: true });

    logger.info(`${path.basename(filepath)}: 書き込み`);
    await fs.writeFile(filepath, JSON.stringify(cacheData, null, 2), encodingString.utf_8);
}

/**
 * Steam Store アプリ一覧のキャッシュをJSONファイルから読み込む
 * 
 * 指定されたファイルパスからキャッシュデータを読み込み、
 * JSONを SteamStoreAppCacheFile として返す。
 * ファイルが存在しない場合やJSONが壊れている場合は null を返す。
 * 
 * @param filepath キャッシュを読み込むファイルパス
 * @returns 読み込んだキャッシュデータ。取得できない場合は null
 */
async function loadSteamStoreCache(filepath:string): Promise<SteamStoreAppCacheFile | null> {
    try {
        logger.info(`${path.basename(filepath)}: 読み込み`);
        const json = await fs.readFile(filepath, encodingString.utf_8);

        return JSON.parse(json) as SteamStoreAppCacheFile;
    }
    catch (error) {
        logger.warn(`${path.basename(filepath)} のファイルが存在しないか壊れています`);
        return null;
    }
}

/**
 * Steam Store のゲーム一覧キャッシュを取得する
 * 
 * キャッシュファイルを読み込み、保存時刻が設定された有効期限内であれば
 * キャッシュ内のSteam Storeゲーム一覧を返す。
 * キャッシュが存在しない、破損している、または有効期限切れの場合は空配列を返す。
 * 
 * @returns 有効なSteam Storeゲーム一覧キャッシュ。取得できない場合は空配列
 */
export async function getCachedAllSteamGames(): Promise<SteamStoreApp[]> {
    const cache = await loadSteamStoreCache(STEAM_STORE_CACHE_FILE_PATHS.STEAM_GAMES);
    const now = Date.now();

    if (cache && now - cache.cachedAt < cacheTime.steamStoreAppList) {
        // キャッシュデータが対象パスに存在し、キャッシュ保存時間が設定された時間内だったらキャッシュデータを返す
        return cache.data;
    }

    // キャッシュが取得できなかった場合は空配列を返す
    return [];    
}