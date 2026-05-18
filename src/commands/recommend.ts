import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel } from "discord.js";
import { runGameRecommendationJob } from "../jobs/steamJob.js";

export const recommendCommand = {

    data: new SlashCommandBuilder().setName("recommend").setDescription("おすすめゲームを表示します"),

    execute: async (interaction: ChatInputCommandInteraction) => {

        await interaction.deferReply();

        const channel = interaction.channel;

        if (!channel || !(channel instanceof TextChannel)) {
            await interaction.followUp("テキストチャンネルで実行してください。");
            return;
        }

        await runGameRecommendationJob(channel);

        await interaction.editReply("おすすめゲームを送信しました");

    }

};
