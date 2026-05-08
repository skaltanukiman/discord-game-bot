import { Client, ChannelType } from "discord.js";
import { env } from "../config/env.js";

export async function onReady(client: Client) {
    console.log(`Logged in as ${client.user?.tag}`);

    const channel = await client.channels.fetch(env.channelId);

    if (!channel) {
        console.log("チャンネルが見つかりません");
        return;
    }

    if (channel.type === ChannelType.GuildText) {
        await channel.send("おすすめゲームBOT 起動！");
    }
}