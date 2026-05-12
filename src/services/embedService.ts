import { ExtendedSteamGameDetail } from "./steamTypeManager.js";
import { createButton, createEmbed } from "../util/embedUtil.js";
import { TextChannel } from "discord.js";
import { setTimeout } from "timers/promises";

export async function unknown(gameDetails:ExtendedSteamGameDetail[], channel: TextChannel) {

    for (const game of gameDetails) {
        const embed = createEmbed(game);
        const buttons = createButton(game);

        await channel.send({ embeds: [embed], components: [buttons] });

        // console.log("今から時を止めます");
        await setTimeout(1000);
        // console.log("動きました");
    }
    
}