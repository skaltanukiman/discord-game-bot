import "dotenv/config";
import { env } from "./config/env.js";
import { onReady } from "./events/ready.js";
import { runGameRecommendationJob } from "./jobs/steamJob.js";
import { processControl, testSettings } from "./config/setting.js";
import { interactionCreateEvent } from "./events/interactionCreate.js";
import { startScheduler } from "./jobs/scheduler.js";
import { discordClient } from "./clients/discordClient.js";
import { logger } from "./util/logger.js";
import { getAllSteamGames } from "./services/steamService.js";
import { SteamStoreApp } from "./services/steamTypeManager.js";

/** イベント処理 **/

// botログイン完了時発火
discordClient.once("clientReady", async () => {

    // チャンネルを取得
    const channel = await onReady();

    if (!channel) {
        logger.warn("チャンネル取得失敗のため終了します");
        process.exit(0);
    }

    // テスト用
    // if (testSettings.testmode) {
    //     const storeInfo: SteamStoreApp[] = await getAllSteamGames();
    //     console.log("★処理完了★");
    //     console.log(`長さ: ${storeInfo.length}`);
    //     // console.log(`appid: ${storeInfo[2000]?.appid}`);
    //     // console.log(`last_modified: ${storeInfo[2000]?.last_modified}`);
    //     // console.log(`name: ${storeInfo[2000]?.name}`);
    //     // console.log(`price_change_number: ${storeInfo[2000]?.price_change_number}`);

    //     console.log("テストモードのため処理を終了します");
    //     process.exit(0);
    // }

    if (processControl.enable.recommendationJob) {
        // 起動時1回実行
        await runGameRecommendationJob(channel);

        if (processControl.enable.recommendationCron) {
            // 定期実行（スケジュール実行）
            startScheduler(channel);
        }
    }

});

// interactionCreate 発生時、interactionCreateEvent() を呼ぶ
discordClient.on("interactionCreate", interactionCreateEvent);

/** 起動時処理 **/
discordClient.login(env.discordToken)
    .catch(error => {
        logger.error("Botログイン失敗", error);
        process.exit(1);
    });
