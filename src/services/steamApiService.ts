import { fetchAllSteamStoreApps } from "./steamService.js";
import { SteamStoreApp } from "./steamTypeManager.js";

/**
 * Steam Store に登録されているゲーム一覧を全件取得する
 * 
 * DLC、ソフトウェア、動画、ハードウェアは除外し、
 * ゲームとして扱われるSteamアプリのみを取得する。
 * 
 * @returns Steam Store上のゲーム一覧
 */
export async function fetchAllSteamGames(): Promise<SteamStoreApp[]> {
    return await fetchAllSteamStoreApps({
        includeGames: true,
        includeDlc: false,
        includeSoftware: false,
        includeVideos: false,
        includeHardware: false,
        maxResults: 50000
    });
}