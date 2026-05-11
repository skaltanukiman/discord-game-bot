import { SteamAppDetailsResponse } from "../services/steamTypeManager.js";

type mostPlayedCacheType = {
    preOffset: number | null,
    preLimit: number | null,
    preFetchTime: number | null,
    key: string | null,  // offset & limit
    data: any
}

type DetailDataCacheType = {
    appidWithFetchTime: Map<number, number>,
    data: SteamAppDetailsResponse
}

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