type mostPlayedCacheType = {
    preOffset: number | null,
    preLimit: number | null,
    preFetchTime: number | null,
    key: string | null,  // offset & limit
    data: any
}

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