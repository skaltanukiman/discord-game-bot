import { Interaction } from "discord.js";
import { commands } from "../managers/commandManager.js";

export async function interactionCreateEvent(interaction: Interaction) {

    try {
        if (!interaction.isChatInputCommand()) return;

        const command = commands.get(interaction.commandName);

        if (!command) {
            console.error("コマンドが取得できませんでした。");
        }

        await command.execute(interaction);
    }
    catch (error) {
        console.error("interactionCreateエラー", error);
    }

}