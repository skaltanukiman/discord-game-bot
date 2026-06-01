import { ChannelType, TextChannel } from "discord.js";
import { env } from "../config/env.js";
import { logger } from "../util/logger.js";
import { discordClient } from "./discordClient.js";

/**
 * 環境変数のチャンネルIDからDiscordのテキストチャンネルを取得する。
 *
 * チャンネルが存在しない場合、またはテキストチャンネルでない場合は null を返す。
 * 取得処理中にエラーが発生した場合はログ出力後、エラーを再スローする。
 *
 * @returns テキストチャンネル。取得できない場合は null。
 */
export async function getTextChannel(): Promise<TextChannel | null> {
    try {
        const channel = await discordClient.channels.fetch(env.channelId);

        if (!channel) {
            logger.info("チャンネルが見つかりません");
            return null;
        }

        if (channel.type !== ChannelType.GuildText) {
            logger.info("テキストチャンネルではありません");
            return null;
        }

        return channel;
    }
    catch (error) {
        logger.error("チャンネルを取得中にエラーが発生しました。", error);
        throw error;
    }

}