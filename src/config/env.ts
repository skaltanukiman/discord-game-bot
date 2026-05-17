/**
 * 指定した環境変数を取得します。
 * 環境変数が未設定の場合は例外をスローします。
 * 
 * @param name 環境変数名
 * @returns 環境変数値
 * @throws Error 環境変数が未設定の場合
 */
function getEnv(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} が未設定です`);
    }

    return value;
}

export const env = {
    discordToken: getEnv("DISCORD_TOKEN"),
    channelId: getEnv("CHANNEL_ID"),
    steamApiKey: getEnv("STEAM_API_KEY"),
    openaiApiKey: getEnv("OPENAI_API_KEY")
};