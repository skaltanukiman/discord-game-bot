import "dotenv/config";
import { env } from "./config/env.js";
import { onReady } from "./events/ready.js";
import { runGameRecommendationJob } from "./jobs/steamJob.js";
import { Client, GatewayIntentBits } from "discord.js";

/** 初期処理 **/
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/** イベント処理 **/

// botログイン完了時発火
client.once("clientReady", async () => {
    const channel = await onReady(client);

    if (!channel) {
        return;
    }

    await runGameRecommendationJob(client, channel);

    // ここに定期実行処理を追加（cronで実装？）
});

/** 起動時処理 **/
client.login(env.discordToken)
    .catch(error => {
        console.error("Botログイン失敗", error);
        process.exit(1);
    });
