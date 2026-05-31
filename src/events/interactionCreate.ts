import { Interaction } from "discord.js";
import { commands } from "../managers/commandManager.js";
import { logger } from "../util/logger.js";

export async function interactionCreateEvent(interaction: Interaction) {

    try {
        if (!interaction.isChatInputCommand()) return;

        const command = commands.get(interaction.commandName);

        if (!command) {
            logger.error(`コマンドが取得できませんでした: ${interaction.commandName}`);

            await interaction.reply({
                content: "このコマンドは現在使用できません。",
                ephemeral: true
            });

            return;
        }

        await command.execute(interaction);
    }
    catch (error) {
        logger.error("interactionCreateエラー", error);
    }

}