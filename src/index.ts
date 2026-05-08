import "dotenv/config";
import { env } from "./config/env.js";
import { onReady } from "./events/ready.js";
import { Client, GatewayIntentBits } from "discord.js";

/** 初期処理 **/
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/** イベント処理 **/

// botログイン完了時発火
client.once("clientReady", async () => {
    await onReady(client);
});

/** 起動時処理 **/
client.login(env.discordToken);