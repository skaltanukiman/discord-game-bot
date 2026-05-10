import { Client, ChannelType, TextChannel } from "discord.js";
import { env } from "../config/env.js";

/**
 * ログイン完了時に、指定されたテキストチャンネルを取得する
 * 
 * @param client Discordクライアント
 * @returns 取得したテキストチャンネル。取得できなかった場合、またはテキストチャンネルでない場合は null
 */
export async function onReady(client: Client): Promise<TextChannel | null> {
    console.log(`Logged in as ${client.user?.tag}`);

    const channel = await client.channels.fetch(env.channelId);

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