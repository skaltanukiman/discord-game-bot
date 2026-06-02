import { ExtendedSteamGameDetail } from "./steamTypeManager.js";
import { createButton, createEmbed } from "../util/embedUtil.js";
import { TextChannel } from "discord.js";
import { setTimeout } from "timers/promises";
import { generalSetting } from "../config/setting.js";
import { logger } from "../util/logger.js";

/**
 * ゲーム詳細情報をDiscordチャンネルへ順番に送信する
 * 
 * 各ゲーム情報からEmbedとボタンを生成し、
 * 一定間隔を空けながらチャンネルへ送信する。
 * 
 * @param gameDetails 送信対象のゲーム詳細情報配列
 * @param channel メッセージ送信先のDiscordテキストチャンネル
 * @returns Embed送信件数
 */
export async function sendGameDetailsToChannel(gameDetails:ExtendedSteamGameDetail[], channel: TextChannel): Promise<number> {
    if (gameDetails.length === 0) {
        logger.info("ゲーム情報が空のため送信処理は行いません");
        return 0;
    }

    if (!generalSetting.send.gameDetails) {
        logger.info("ゲーム詳細送信設定が無効のため、Discord送信は行わずEmbed生成のみ実行します");
    }

    let sendCount: number = 0;
    for (const game of gameDetails) {
        const embed = await createEmbed(game);
        const buttons = createButton(game);

        if (generalSetting.send.gameDetails) {
            await channel.send({ embeds: [embed], components: [buttons] });
            sendCount++;
        }
        
        await setTimeout(1000);
    }

    return sendCount;
}