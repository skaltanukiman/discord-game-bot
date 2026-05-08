import { Client, TextChannel } from "discord.js";
import { getMostPlayedGames } from "../services/steamService.js";

export async function runGameRecommendationJob(client: Client, channel: TextChannel) {
    await channel.send("おすすめゲームBOT 起動！");
    // const ranks = await getMostPlayedGames();
    // console.log(ranks);
}