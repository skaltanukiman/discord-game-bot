import { TextChannel } from "discord.js";
import { getMostPlayedGameDetails } from "../services/steamService.js";
import { ExtendedSteamGameDetail } from "../services/steamTypeManager.js";
import { filterMultiplayerGames, pickRandomvaluesFromMap } from "../util/filtering.js";
import { testSettings } from "../config/setting.js";
import { sendGameDetailsToChannel } from "../services/embedService.js"

export async function runGameRecommendationJob(channel: TextChannel) {

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
        return;
    }

    if (testSettings.testmode) {
        // const gameDetails: ExtendedSteamGameDetail[] = [];

        // 全件
        // for (const val of filteredMap.values()) {
        //     gameDetails.push(val);
        // }

        // ランダム（要素数指定）
        const gameDetails: ExtendedSteamGameDetail[] = pickRandomvaluesFromMap(filteredMap, 15);
        
        // filterMapよりDISCORDに送りたいものだけをgameDetailsに配列として格納し、[sendGameDetailsToChannel]を叩く

        await sendGameDetailsToChannel(gameDetails, channel);
    }

}