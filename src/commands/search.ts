import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { logger } from "../util/logger.js";
import { getAllSteamGames } from "../services/steamService.js";
import { searchSteamApps } from "../services/steamSearchService.js";

const GAME_SEARCH_COMMAND_NAME = {
    KEYWORD: "keyword"
} as const;

export const gameSearchCommand = {

    data: new SlashCommandBuilder()
        .setName("game_search")
        .setDescription("ゲーム名を検索し、該当ゲームの詳細情報を表示します")

        .addStringOption(option =>
            option.setName(GAME_SEARCH_COMMAND_NAME.KEYWORD)
                  .setDescription("検索するゲーム名")
                  .setRequired(true)

        ),

    execute: async (interaction: ChatInputCommandInteraction) => {

        try {
            await interaction.deferReply();

            const keyword = interaction.options.getString(GAME_SEARCH_COMMAND_NAME.KEYWORD, true);

            const apps = await getAllSteamGames();

            const searchResults = searchSteamApps(apps, keyword, 10);

            if (searchResults.length === 0) {
                await interaction.editReply({
                    content: "該当するゲームが見つかりませんでした。"
                });
                return;
            }

            // 以降、検索結果ありの場合の処理を記載する

            console.log(`検索結果（長さ）: ${searchResults.length}`);

            await interaction.editReply("ゲームの検索終了");

        }
        catch (error) {
            logger.error("ゲーム検索コマンド実行エラー", error);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply("ゲーム検索中にエラーが発生しました。");
            }
        }
        
    }
}