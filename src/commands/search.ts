import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { logger } from "../util/logger.js";
import { buildGameDetailsWithCurrentPlayerCounts, fetchCurrentPlayerCounts, getAllSteamGames, getDetailGameDatas, mergeSteamDetailsWithCurrentPlayers } from "../services/steamService.js";
import { searchSteamApps } from "../services/steamSearchService.js";
import { getTextChannel } from "../clients/channel.js";
import { sendGameDetailsToChannel } from "../services/embedService.js";
import { GENERATION_LIMIT } from "../services/openaiService.js";
import { requestContext } from "../context/requestContext.js";

const GAME_SEARCH_COMMAND_NAME = {
    KEYWORD: "keyword",
    USEOPENAI: "use_openai"
} as const;

export const gameSearchCommand = {

    data: new SlashCommandBuilder()
        .setName("game_search")
        .setDescription("ゲーム名を検索し、該当ゲームの詳細情報を表示します")

        .addStringOption(option =>
            option.setName(GAME_SEARCH_COMMAND_NAME.KEYWORD)
                  .setDescription("検索するゲーム名")
                  .setRequired(true)

        )

        .addBooleanOption(option =>
            option.setName(GAME_SEARCH_COMMAND_NAME.USEOPENAI)
                  .setDescription(`OpenAIで説明文を生成する（一回のリクエストにつき最大連続${GENERATION_LIMIT}件まで）`)
                  .setRequired(false)
        ),

    execute: async (interaction: ChatInputCommandInteraction) => {

        const LIMIT : number = 10;

        try {
            await interaction.deferReply();

            await interaction.editReply("検索中～～～");

            const keyword = interaction.options.getString(GAME_SEARCH_COMMAND_NAME.KEYWORD, true);

            const channel = await getTextChannel();

            if (!channel) {
                logger.warn("チャンネルが取得出来なかったため処理を中断します");

                await interaction.editReply({
                    content: "チャンネルが取得出来なかったため処理を中断します"
                });
                return;
            }

            const apps = await getAllSteamGames();

            const searchResults = searchSteamApps(apps, keyword, 0);

            if (searchResults.length === 0) {
                await interaction.editReply({
                    content: "該当するゲームが見つかりませんでした。"
                });
                return;
            }

            const slicedResults = searchResults.slice(0, LIMIT);

            if (searchResults.length > LIMIT) {
                await interaction.followUp({
                    content: `検索結果が ${searchResults.length} 件あるから ${slicedResults.length} 件まで検索結果を切り捨てるよ～`,
                    ephemeral: true
                });
            }

            const appids: number[] = slicedResults.map(x => x.appid);

            const gameDetails = await buildGameDetailsWithCurrentPlayerCounts(appids);

            requestContext.run(
                {
                    useOpenAI: interaction.options.getBoolean(GAME_SEARCH_COMMAND_NAME.USEOPENAI) ?? false,
                    generateCount: 0
                },
                async () => {
                    await sendGameDetailsToChannel(gameDetails, channel);
                }
            );
            
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