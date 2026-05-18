import { Interaction } from "discord.js";
import { commands } from "../managers/commandManager.js";

export async function interactionCreateEvent(interaction: Interaction) {

    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    await command.execute(interaction);
}