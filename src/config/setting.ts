type cacheTimeType = {
    mostPlayed: number
}

export const cacheTime: cacheTimeType = {
    mostPlayed: 1
}

type cronCycleType = {
    index: string
}

export const cronCycle: cronCycleType = {
    // (秒) 分 時 日 月 曜日
    index: "*/180 * * * * *"
}

type testSettingsType = {
    testmode: boolean
}

export const testSettings: testSettingsType = {
    testmode: false
}