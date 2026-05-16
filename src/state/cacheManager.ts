import { error } from "node:console";
import { cacheTime } from "../config/setting.js";
import { CurrentPlayersData, CurrentPlayersResponse, SteamAppDetailsResponse } from "../services/steamTypeManager.js";
import { isWithinMinutes } from "../util/timeUtil.js";

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

export function initializeMostPlayedCache () {
    mostPlayedCache.preOffset = null;
    mostPlayedCache.preLimit = null;
    mostPlayedCache.preFetchTime = null;
    mostPlayedCache.key = null;
    mostPlayedCache.data = null;
}

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
        console.error(`キャッシュの取得に失敗しました。[${cache}]`, error);
        return false;
    }
}

export function getCacheData<T extends Record<string, any>>(cache: CacheType<T>, appidStr: string) {
    return cache.data[appidStr];
}

export function setCacheData<T>(cache: CacheType<Record<string, T>>, appid: number, appidStr: string, data: Record<string, T>) {
    cache.appidWithFetchTime.set(appid, Date.now());

    if (data[appidStr] == null) {
        console.error(`キャッシュ値をセットできませんでした。[ID: ${appid}]`);
        return;
    }
    cache.data[appidStr] = data[appidStr];
}

/**
 * 詳細データをキャッシュから取得するかの検証を行う
 * 
 * @param appid 検証対象の詳細データID
 * @returns キャッシュから取得する場合True、APIから取得する場合false
 */
// export function isDetailCacheValid(appid: number): boolean {
//     if (!detailDataCache) return false;
    
//     if (!detailDataCache.appidWithFetchTime.has(appid)) return false;

//     const preFetchTime = detailDataCache.appidWithFetchTime.get(appid);

//     if (!preFetchTime) return false;

//     // 時刻差異が指定された分数以内の場合、キャッシュから取得
//     return isWithinMinutes(preFetchTime, cacheTime.mostPlayed);
// }

/**
 * 引数で渡されたIDのキャッシュデータを返却する
 * 
 * @param appidStr 取得するキャッシュデータのID（文字列）
 */
// export function getDetailCache(appidStr: string) {
//     return detailDataCache.data[appidStr];
// }

/**
 * キャッシュ関連のデータをセットする。
 * 
 * @param キャッシュするデータ群
 */
// export function setDetailCache(appid: number, appidStr: string, data: SteamAppDetailsResponse) {
//     detailDataCache.appidWithFetchTime.set(appid, Date.now());
//     detailDataCache.data[appidStr] = data[appidStr]!;
// }