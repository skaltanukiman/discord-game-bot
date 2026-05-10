import "dotenv/config";
import { env } from "./config/env.js";
import { onReady } from "./events/ready.js";
import { runGameRecommendationJob } from "./jobs/steamJob.js";
import { cronCycle } from "./config/setting.js";
import { Client, GatewayIntentBits } from "discord.js";
import cron from "node-cron";

/** 初期処理 **/
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

/** イベント処理 **/

// botログイン完了時発火
client.once("clientReady", async () => {

    // チャンネルを取得
    const channel = await onReady(client);

    if (!channel) {
        console.log("チャンネル取得失敗のため終了します");
        process.exit(0);
    }

    await runGameRecommendationJob(client, channel);

    // 定期実行
    cron.schedule(cronCycle.index, async () => {

        try {
            console.log("定期実行開始");
            await runGameRecommendationJob(client, channel);
        }
        catch (error) {
            console.error("cron実行エラー", error);
            process.exit(1);
        }
    });
});

/** 起動時処理 **/
client.login(env.discordToken)
    .catch(error => {
        console.error("Botログイン失敗", error);
        process.exit(1);
    });
