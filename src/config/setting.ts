//#region 型定義

type cacheTimeType = {
    mostPlayed: number;
    detailData: number;
    currentPlayer: number;
    steamStoreAppList: number;
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

type ProcessControlType = {
    enable: {
        recommendationJob: boolean;
        recommendationCron: boolean;
    };
}

type ProcessWaitTimeType = {
    fetchAllSteamStoreApps: number;
}

//#endregion

export const cacheTime: cacheTimeType = {
    mostPlayed: 10,    // 分
    detailData: 1440,  // 分（1440:一日）
    currentPlayer: 60,
    steamStoreAppList: 1000 * 60 * 60 * 24 // 24時間
}

export const cronCycle: cronCycleType = {
    // (秒) 分 時 日 月 曜日
    index: "*/60 * * * * *"
}

export const testSettings: testSettingsType = {
    testmode: false
}

export const mostPlayed: MostPlayedType = {
    offset: 0,
    limit: 0
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
        descriptionGenerate: true    // ゲーム説明欄テキストをopenaiAPIを使用し、ランダム生成するか
    }
}

export const processControl: ProcessControlType = {
    enable: {
        recommendationJob: false,  // 起動時にゲーム紹介通知を走らせるか
        recommendationCron: false  // 定期実行を行うか
    }
}

export const processWaitTime: ProcessWaitTimeType = {
    fetchAllSteamStoreApps: 500
}