import cron from "node-cron";
import { cronCycle } from "../config/setting.js";
import { runGameRecommendationJob } from "./steamJob.js";
import type { TextChannel } from "discord.js";
import { logger } from "../util/logger.js";

/**
 * ゲーム紹介ジョブの定期実行を開始します。
 * 
 * @param channel Discordへメッセージ送信を行う対象チャンネル
 */
export function startScheduler(channel: TextChannel) {

    cron.schedule(cronCycle.index, async () => {

        try {
            logger.info("定期実行開始");
            await runGameRecommendationJob(channel);
        }
        catch (error) {
            logger.error("cron実行中エラー", error);
            process.exit(1);
        }
    });
}