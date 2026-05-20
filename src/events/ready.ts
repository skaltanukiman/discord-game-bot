import { ChannelType, TextChannel } from "discord.js";
import { env } from "../config/env.js";
import { discordClient } from "../clients/discordClient.js";
import { logger } from "../util/logger.js";

/**
 * ログイン完了時に、指定されたテキストチャンネルを取得する
 * 
 * @param discordClient Discordクライアント
 * @returns 取得したテキストチャンネル。取得できなかった場合、またはテキストチャンネルでない場合は null
 */
export async function onReady(): Promise<TextChannel | null> {
    logger.info(`Logged in as ${discordClient.user?.tag}`);
    // console.log(`Logged in as ${discordClient.user?.tag}`);

    const channel = await discordClient.channels.fetch(env.channelId);

    if (!channel) {
        console.log("チャンネルが見つかりません");
        return null;
    }

    if (channel.type !== ChannelType.GuildText) {
        console.log("テキストチャンネルではありません");
        return null;
    }

    return channel;
}