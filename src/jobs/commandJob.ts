import { TextChannel } from "discord.js";
import { getMostPlayedGameDetails } from "../services/steamService.js";
import { ExtendedSteamGameDetail } from "../services/steamTypeManager.js";
import { filterMultiplayerGames, pickRandomvaluesFromMap } from "../util/filtering.js";
import { testSettings } from "../config/setting.js";
import { sendGameDetailsToChannel } from "../services/embedService.js"
import { RecommendMode } from "../commands/commandCommonVal.js";
import { logger } from "../util/logger.js";

export async function runGameRecommendByRankJob(channel: TextChannel, count: number, mode: number) {
    logger.info(`count: ${count}, mode: ${mode}`);

    const steamDataMap = await getMostPlayedGameDetails();

    if (!steamDataMap || steamDataMap.size === 0) {
        logger.info("steamデータが空のため、処理をスキップします。");
        return;
    }

    // console.log("Mapデータ");
    // console.log(steamDataMap);

    console.log(`削除前: ${steamDataMap.size}`);
    const filteredMap = filterMultiplayerGames(steamDataMap);
    console.log(`削除後: ${filteredMap.size}`);

    if (filteredMap.size === 0) {
        logger.info("フィルター結果が空のため、処理をスキップします。");
        return;
    }

    const gameDetails: ExtendedSteamGameDetail[] = [];
    if (mode === RecommendMode.Rank) {

        const sorted = [...filteredMap.values()]
            .sort((a, b) => a.mostplayed.rank - b.mostplayed.rank)
            .slice(0, count);

            gameDetails.push(...sorted);
    }
    else if (mode === RecommendMode.Random) {
        // ランダム（要素数指定）
        const random = pickRandomvaluesFromMap(filteredMap, count);

        gameDetails.push(...random);
    }
    else {
        throw new Error(`不正なモード値です: ${mode}`);
    }

    if (gameDetails.length === 0) {
        logger.info("抽出結果が空のため、処理をスキップします。");
        return;
    }

    // filterMapよりDISCORDに送りたいものだけをgameDetailsに配列として格納し、[sendGameDetailsToChannel]を叩く
    await sendGameDetailsToChannel(gameDetails, channel);
}