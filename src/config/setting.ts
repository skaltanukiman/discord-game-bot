//#region 型定義

type cacheTimeType = {
    mostPlayed: number;
    detailData: number;
    currentPlayer: number;
}

type cronCycleType = {
    index: string;
}

type testSettingsType = {
    testmode: boolean;
}

type MostPlayedType = {
    offset: number;
    limit: number;
}

type ConcurrencyOptionsType = {
    gameDetail: number;
    currentPlayer: number;
}

type GeneralSettingType = {
    send: {
        gameDetails: boolean;
    };
    api: {
        descriptionGenerate: boolean;
    };
}

//#endregion

export const cacheTime: cacheTimeType = {
    mostPlayed: 1,    // 分
    detailData: 1440,  // 分（1440:一日）
    currentPlayer: 60
}

export const cronCycle: cronCycleType = {
    // (秒) 分 時 日 月 曜日
    index: "*/60 * * * * *"
}

export const testSettings: testSettingsType = {
    testmode: true
}

export const mostPlayed: MostPlayedType = {
    offset: 0,
    limit: 2
}

export const concurrencyOptions: ConcurrencyOptionsType = {
    gameDetail: 10,
    currentPlayer: 10
}

export const generalSetting: GeneralSettingType = {
    send: {
        gameDetails: true
    },
    api: {
        descriptionGenerate: false
    }
}