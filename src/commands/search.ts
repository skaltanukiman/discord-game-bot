import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { logger } from "../util/logger.js";
import { fetchCurrentPlayerCounts, getAllSteamGames, getDetailGameDatas } from "../services/steamService.js";
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

        const LIMIT : number = 10;

        try {
            await interaction.deferReply();

            await interaction.editReply("検索中～～～");

            const keyword = interaction.options.getString(GAME_SEARCH_COMMAND_NAME.KEYWORD, true);

            const apps = await getAllSteamGames();

            const searchResults = searchSteamApps(apps, keyword, 0);

            if (searchResults.length === 0) {
                await interaction.editReply({
                    content: "該当するゲームが見つかりませんでした。"
                });
                return;
            }

            // 以降、検索結果ありの場合の処理を記載する

            const slicedResults = searchResults.slice(0, LIMIT);

            await interaction.followUp({
                content: `検索結果が ${searchResults.length} 件あるから ${slicedResults.length} 件まで検索結果を切り捨てるよ～`,
                ephemeral: true
            });

            const appids: number[] = slicedResults.map(x => x.appid);

            const [detailData, currentPlayer] = await Promise.all([
                getDetailGameDatas(appids),
                fetchCurrentPlayerCounts(appids)
            ]);

            await interaction.editReply("ゲームの検索終了！");

        }
        catch (error) {
            logger.error("ゲーム検索コマンド実行エラー", error);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply("ゲーム検索中にエラーが発生しました。");
            }
        }
        
    }
}