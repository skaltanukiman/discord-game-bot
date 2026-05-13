import { ActionRowBuilder, APIEmbed, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, TextChannel } from "discord.js";
import { getMostPlayedGameDetails } from "../services/steamService.js";
import { categoryGroups } from "../structure/categorise.js";
import { SteamAppDetailsResponse, MostPlayedGame, ExtendedSteamGameDetail } from "../services/steamTypeManager.js";
import { filterMultiplayerGames } from "../util/filtering.js";
import { testSettings } from "../config/setting.js";
import { createEmbed } from "../util/embedUtil.js";
import { sendGameDetailsToChannel } from "../services/embedService.js"

export async function runGameRecommendationJob(client: Client, channel: TextChannel) {

    const steamDataMap = await getMostPlayedGameDetails();

    if (!steamDataMap || steamDataMap.size === 0) {
        console.log("steamデータが空のため、処理をスキップします。");
        return;
    }

    // console.log("Mapデータ");
    // console.log(steamDataMap);

    console.log(`削除前: ${steamDataMap.size}`);
    const filteredMap = filterMultiplayerGames(steamDataMap);
    console.log(`削除後: ${filteredMap.size}`);

    if (filteredMap.size === 0) {
        console.log("フィルター結果が空のため、処理をスキップします。");
    }

    if (testSettings.testmode) {
        const gameDetails: ExtendedSteamGameDetail[] = [];
        gameDetails.push(filteredMap.get(730)!);
        gameDetails.push(filteredMap.get(578080)!);

        // filterMapよりDISCORDに送りたいものだけをgameDetailsに配列として格納し、unknownを叩く

        await sendGameDetailsToChannel(gameDetails, channel);
    }


}