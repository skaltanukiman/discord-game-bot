import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { runGameRecommendByRankJob } from "../jobs/commandJob.js";
import { RecommendMode } from "./commandCommonVal.js";
import { requestContext } from "../context/requestContext.js";
import { GENERATION_LIMIT } from "../services/openaiService.js";

const commandStr = {
    recommend: {
        count: "count",
        sortMode: "sort_mode",
        useOpenAI: "use_openai"
    }
}

export const recommendCommand = {

    data: new SlashCommandBuilder()
        .setName("period_ranking")
        .setDescription("STEAM同時接続ランキング（一定期間）よりおすすめゲームを表示します（最大20件）")
        
        .addIntegerOption(option =>
            option.setName(commandStr.recommend.count)
                  .setDescription("取得件数")
                  .setRequired(false)
                  .setMinValue(1)
                  .setMaxValue(20)
        )
        
        .addIntegerOption(option =>
            option.setName(commandStr.recommend.sortMode)
                  .setDescription("抽出モード")
                  .setRequired(false)
                  .addChoices(
                    { name: "ランク順", value: RecommendMode.Rank },
                    { name: "ランダム", value: RecommendMode.Random }
                  )
        )
        
        .addBooleanOption(option =>
            option.setName(commandStr.recommend.useOpenAI)
                  .setDescription(`OpenAIで説明文を生成する（一回のリクエストにつき最大連続${GENERATION_LIMIT}件まで）`)
                  .setRequired(false)
        ),

    execute: async (interaction: ChatInputCommandInteraction) => {

        try {
            await interaction.deferReply();

            const count = interaction.options.getInteger(commandStr.recommend.count) ?? 5;
            const mode = interaction.options.getInteger(commandStr.recommend.sortMode) ?? RecommendMode.Rank;

            const channel = interaction.channel;

            if (!channel || !(channel instanceof TextChannel)) {
                await interaction.editReply("テキストチャンネルで実行してください。");
                return;
            }

            requestContext.run(
                {
                    useOpenAI: interaction.options.getBoolean(commandStr.recommend.useOpenAI) ?? false,
                    generateCount: 0
                },
                async () => {
                    await runGameRecommendByRankJob(channel, count, mode);
                }
            );
            

            await interaction.editReply("おすすめゲームを送信しました");
        }
        catch(error) {
            console.error(`${recommendCommand}内でエラー発生`, error);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply("コマンド処理中にエラーが発生しました");
            }
        }

    }

};
