import { Client, TextChannel } from "discord.js";
import { getMostPlayedGames, getDetailGameDatas } from "../services/steamService.js";

export async function runGameRecommendationJob(client: Client, channel: TextChannel) {
    // await channel.send("おすすめゲームBOT 起動！");
    const ranks = await getMostPlayedGames(0,3);
    console.log(ranks);

    if (!ranks || ranks.length === 0) {
        console.log("ランキングデータが取得できなかったため、処理をスキップします。");
        return;
    }

    const appids: number[] = ranks.map(x => x.appid);

    await getDetailGameDatas(appids);
}