import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { logger } from "../util/logger.js";
import { buildGameDetailsWithCurrentPlayerCounts, getAllSteamGames } from "../services/steamService.js";
import { searchSteamApps } from "../services/steamSearchService.js";
import { getTextChannel } from "../clients/channel.js";
import { sendGameDetailsToChannel } from "../services/embedService.js";
import { GENERATION_LIMIT } from "../services/openaiService.js";
import { requestContext } from "../context/requestContext.js";
import { categoryGroups } from "../structure/categorise.js";
import { GameFiltering } from "./commandCommonVal.js";
import { ExtendedSteamGameDetail } from "../services/steamTypeManager.js";
import { filterMultiplayerGamesArray, filterSingleplayerGamesArray } from "../util/filtering.js";

const GAME_SEARCH_COMMAND_NAME = {
    KEYWORD: "keyword",
    USEOPENAI: "use_openai",
    PLAYTYPE: "play_type"
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
        )

        .addIntegerOption(option =>
            option.setName(GAME_SEARCH_COMMAND_NAME.PLAYTYPE)
                  .setDescription("シングルプレイ/マルチプレイでフィルター（選択無しの場合、フィルタリングなし）")
                  .setRequired(false)
                  .addChoices(
                    { name: "シングルプレイ", value: GameFiltering.SinglePlay },
                    { name: "マルチプレイ", value: GameFiltering.MultiPlay }
                  )
        ),

    execute: async (interaction: ChatInputCommandInteraction) => {

        const LIMIT : number = 10;

        try {
            await interaction.deferReply();

            await interaction.editReply("検索中～～～");

            const keyword = interaction.options.getString(GAME_SEARCH_COMMAND_NAME.KEYWORD, true);
            const playType = interaction.options.getInteger(GAME_SEARCH_COMMAND_NAME.PLAYTYPE) ?? GameFiltering.All;

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

            const sendDetails = filterDetails(gameDetails, playType);

            requestContext.run(
                {
                    useOpenAI: interaction.options.getBoolean(GAME_SEARCH_COMMAND_NAME.USEOPENAI) ?? false,
                    generateCount: 0
                },
                async () => {
                    await sendGameDetailsToChannel(sendDetails, channel);
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

/**
 * プレイ種別に応じてSteamゲーム詳細データを絞り込む。
 *
 * すべて、シングルプレイ対応、マルチプレイ対応のいずれかで
 * ゲーム詳細データを絞り込んで返却する。
 *
 * @param gameDetails 絞り込み対象のSteamゲーム詳細データ配列
 * @param playType 絞り込みに使用するプレイ種別
 * @returns 絞り込み後のSteamゲーム詳細データ配列
 * @throws playType が不正値の場合
 */
function filterDetails(gameDetails: ExtendedSteamGameDetail[], playType: number): ExtendedSteamGameDetail[] {
    switch (playType) {
        case GameFiltering.All:
            console.log("全てを返却します。");
            return gameDetails;

        case GameFiltering.SinglePlay:
            console.log("シングルプレイカテゴリを含むものを返却します。");
            return filterSingleplayerGamesArray(gameDetails);

        case GameFiltering.MultiPlay:
            console.log("マルチプレイカテゴリを含むものを返却します。");
            return filterMultiplayerGamesArray(gameDetails);

        default:
            throw new Error("filterDetailsに渡されたplayTypeが不正値です");
    }
}