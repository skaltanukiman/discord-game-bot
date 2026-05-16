type cacheTimeType = {
    mostPlayed: number;
    detailData: number;
    currentPlayer: number;
}

export const cacheTime: cacheTimeType = {
    mostPlayed: 1,    // 分
    detailData: 1440,  // 分（1440:一日）
    currentPlayer: 60
}

type cronCycleType = {
    index: string;
}

export const cronCycle: cronCycleType = {
    // (秒) 分 時 日 月 曜日
    index: "*/60 * * * * *"
}

type testSettingsType = {
    testmode: boolean;
}

export const testSettings: testSettingsType = {
    testmode: true
}

type MostPlayedType = {
    offset: number;
    limit: number;
}

export const mostPlayed: MostPlayedType = {
    offset: 0,
    limit: 0
}