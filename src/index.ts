import dotenv from "dotenv";
import { Client, GatewayIntentBits, TextChannel, ChannelType } from "discord.js";

// .env取得
dotenv.config();

// パラメタチェック
const discordToken = process.env.DISCORD_TOKEN;
if (!discordToken) {
    throw new Error("DISCORD_TOKENが未設定です");
}

const channelId = process.env.CHANNEL_ID;
if (!channelId) {
    throw new Error("CHANNEL_IDが未設定です");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// botログイン完了時発火
client.once("clientReady", async () => {
    console.log(`Logged in as ${client.user?.tag}`);



    const channel = await client.channels.fetch(channelId);

    if (!channel) {
        console.log("チャンネルが見つかりません");
        return;
    }

    if (channel.type === ChannelType.GuildText) {
        await channel.send("おすすめゲームBOT 起動！");
    }
});

client.login(discordToken);