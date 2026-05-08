function getEnv(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} が未設定です`);
    }

    return value;
}

export const env = {
    discordToken: getEnv("DISCORD_TOKEN"),
    channelId: getEnv("CHANNEL_ID")
};