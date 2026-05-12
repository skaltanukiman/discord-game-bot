import { APIEmbedField, EmbedBuilder } from "discord.js";

export function addFieldsIfExists(embed: EmbedBuilder, embedFields?: APIEmbedField[]) {

    if (embedFields) {
        embed.addFields(embedFields);
    }
}