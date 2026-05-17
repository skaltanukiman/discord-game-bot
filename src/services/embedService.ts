import { ExtendedSteamGameDetail } from "./steamTypeManager.js";
import { createButton, createEmbed } from "../util/embedUtil.js";
import { TextChannel } from "discord.js";
import { setTimeout } from "timers/promises";
import { generalSetting } from "../config/setting.js";

/**
 * ゲーム詳細情報をDiscordチャンネルへ順番に送信する
 * 
 * 各ゲーム情報からEmbedとボタンを生成し、
 * 一定間隔を空けながらチャンネルへ送信する。
 * 
 * @param gameDetails 送信対象のゲーム詳細情報配列
 * @param channel メッセージ送信先のDiscordテキストチャンネル
 */
export async function sendGameDetailsToChannel(gameDetails:ExtendedSteamGameDetail[], channel: TextChannel) {

    for (const game of gameDetails) {
        const embed = createEmbed(game);
        const buttons = createButton(game);

        if (generalSetting.send.gameDetails) {
            await channel.send({ embeds: [embed], components: [buttons] });
        }
        
        // console.log("今から時を止めます");
        await setTimeout(1000);
        // console.log("動きました");
    }
    
}