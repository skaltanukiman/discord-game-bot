import axios from "axios";
import { env } from "../config/env.js";

export async function getMostPlayedGames(offset: number = 0, limit: number = 0) {
    // パラメタが負数の場合0とみなす
    offset = Math.max(0, offset);
    limit = Math.max(0, limit);

    try {
        const response = await axios.get(
            "https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/",
            {
                params: {
                    key: env.steamApiKey
                }
            }
        );

        const ranks = response.data?.response?.ranks;

        if (!ranks || !Array.isArray(ranks)) {
            console.error("ランキング取得失敗");
            return [];
        }

        if (offset === 0 && limit === 0) {
            return ranks;
        }
        else {
            return ranks.slice(offset, offset + limit);
        }
    }
    catch (error) {
        console.error("Steam API 取得処理エラー", error);
        return [];
    }
}