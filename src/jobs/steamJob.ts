import { Client, TextChannel } from "discord.js";
import { getMostPlayedGames, getDetailGameDatas, steamDataMarge } from "../services/steamService.js";
import { categoryGroups } from "../structure/categorise.js";
import { SteamAppDetailsResponse, MostPlayedGame, ExtendedSteamGameDetail } from "../services/steamTypeManager.js";

export async function runGameRecommendationJob(client: Client, channel: TextChannel) {
    // await channel.send("おすすめゲームBOT 起動！");
    const ranks = await getMostPlayedGames();
    // console.log(ranks);

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

    const steamDataMap = steamDataMarge(appids, ranks, detailData);

    if (steamDataMap.size === 0) {
        console.log("steamデータが空のため、処理をスキップします。");
        return;
    }

    // console.log("Mapデータ");
    // console.log(steamDataMap);
    filterling(steamDataMap);


}

function filterling(steamDataMap: Map<number, ExtendedSteamGameDetail>) {
    console.log(`削除前: ${steamDataMap.size}`);

    for (const [key,val] of steamDataMap) {
        const cat = val.steamDetail.categories?.map(x => x.id);
        const set = new Set(categoryGroups.multiPlay);
        if (!cat?.some(x => set.has(x))) {
            steamDataMap.delete(key);
        }
    }

    console.log(`削除後: ${steamDataMap.size}`)
}