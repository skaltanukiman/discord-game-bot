import { Client, TextChannel } from "discord.js";
import { getMostPlayedGames, getDetailGameDatas, steamDataMarge } from "../services/steamService.js";
import { categoryGroups } from "../structure/categorise.js";
import { SteamAppDetailsResponse, MostPlayedGame, ExtendedSteamGameDetail } from "../services/steamTypeManager.js";
import { filterMultiplayerGames } from "../util/filtering.js";
import { testSettings } from "../config/setting.js";
import { createEmbed } from "../util/embedUtil.js";

export async function runGameRecommendationJob(client: Client, channel: TextChannel) {
    const ranks = await getMostPlayedGames(0, 5);
    console.log(ranks);

    if (!ranks || ranks.length === 0) {
        console.log("ランキングデータが取得できなかったため、処理をスキップします。");
        return;
    }

    const appids: number[] = ranks.map(x => x.appid);

    const detailData = await getDetailGameDatas(appids);

    if (!detailData || Object.keys(detailData).length === 0) {
        console.log("詳細データが取得できなかったため、処理をスキップします。");
        return;
    }

    // console.log("詳細データ");
    // console.log(detailData);

    const steamDataMap = steamDataMarge(appids, ranks, detailData);

    if (steamDataMap.size === 0) {
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
        const embed = createEmbed(filteredMap.get(730)!);
        await channel.send({ embeds: [embed] });
    }


}