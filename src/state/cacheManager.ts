import { CurrentPlayersData, SteamAppDetailsResponse } from "../services/steamTypeManager.js";
import { isWithinMinutes } from "../util/timeUtil.js";

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
        console.error(`キャッシュの取得に失敗しました。[${cache}]`, error);
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
        console.error(`キャッシュ値をセットできませんでした。[ID: ${appid}]`);
        return;
    }
    cache.data[appidStr] = data[appidStr];
}