import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { ExtendedSteamGameDetail } from "../services/steamTypeManager.js";
import { addFieldsIfExists } from "../helper/embedHelper.js";

export function createEmbed(data: ExtendedSteamGameDetail) {
    const title = data.steamDetail.name;
    const headerImage = data.steamDetail.header_image;

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription("今宵はハンバーグじゃ");

    headerImage && embed.setImage(headerImage);
    addFieldsIfExists(embed);  // fieldを付与する（実装中）

    return embed;
}

export function createButton(data: ExtendedSteamGameDetail) {
    const appid = data.mostplayed.appid;

    const buttons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(new ButtonBuilder().setLabel("Steamを見る").setStyle(ButtonStyle.Link).setURL(`https://store.steampowered.com/app/${appid}`));

    return buttons;
}