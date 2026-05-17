import "dotenv/config";
import { env } from "./config/env.js";
import { onReady } from "./events/ready.js";
import { runGameRecommendationJob } from "./jobs/steamJob.js";
import { cronCycle, testSettings } from "./config/setting.js";
import { Client, GatewayIntentBits, EmbedBuilder  } from "discord.js";
import OpenAI from "openai";
import cron from "node-cron";

/** 初期処理 **/
export const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });
export const openai = new OpenAI({apiKey: env.openaiApiKey});

/** イベント処理 **/

// botログイン完了時発火
discordClient.once("clientReady", async () => {

    // チャンネルを取得
    const channel = await onReady();

    if (!channel) {
        console.log("チャンネル取得失敗のため終了します");
        process.exit(0);
    }

    // テスト用
    // if (testSettings.testmode) {
    //     const embeds: EmbedBuilder[] = [];

    //     await channel.send({ embeds: embeds });

    //     console.log("テストモードのため処理を終了します");
    //     process.exit(0);
    // }

    await runGameRecommendationJob(channel);

    // 定期実行
    cron.schedule(cronCycle.index, async () => {

        try {
            console.log("定期実行開始");
            await runGameRecommendationJob(channel);
        }
        catch (error) {
            console.error("cron実行中エラー", error);
            process.exit(1);
        }
    });
});

/** 起動時処理 **/
discordClient.login(env.discordToken)
    .catch(error => {
        console.error("Botログイン失敗", error);
        process.exit(1);
    });
