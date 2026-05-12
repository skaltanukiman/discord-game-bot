import { EmbedBuilder } from "discord.js";
import { ExtendedSteamGameDetail } from "../services/steamTypeManager.js";
import { addFieldsIfExists } from "../helper/embedHelper.js";

export function createEmbed(data: ExtendedSteamGameDetail) {
    const title = data.steamDetail.name;
    const headerImage = data.steamDetail.header_image;

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription("今宵はハンバーグじゃ");

    embed.setDescription("ぽこアポ県物のじゃｄｓでゃｓづいあｓｈ");

    headerImage && embed.setImage(headerImage);
    addFieldsIfExists(embed);  // fieldを付与する（実装中）

    return embed;
}