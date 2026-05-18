import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const pingCommand = {
    data: new SlashCommandBuilder().setName("ping").setDescription("PINGを返します"),
    
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply("Pong!");
    }
};