import "dotenv/config";
import { env } from "./config/env.js";
import { onReady } from "./events/ready.js";
import { runGameRecommendationJob } from "./jobs/steamJob.js";
import { cronCycle, processControl, testSettings } from "./config/setting.js";
import { Client, GatewayIntentBits, EmbedBuilder  } from "discord.js";
import OpenAI from "openai";
import cron from "node-cron";
import { interactionCreateEvent } from "./events/interactionCreate.js";
import { startScheduler } from "./jobs/scheduler.js";

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

    if (processControl.enable.recommendationJob) {
        // 起動時1回実行
        await runGameRecommendationJob(channel);

        // 定期実行（スケジュール実行）
        startScheduler(channel);
    }

});

// interactionCreate 発生時、interactionCreateEvent() を呼ぶ
discordClient.on("interactionCreate", interactionCreateEvent);

/** 起動時処理 **/
discordClient.login(env.discordToken)
    .catch(error => {
        console.error("Botログイン失敗", error);
        process.exit(1);
    });
