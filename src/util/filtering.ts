import { ExtendedSteamGameDetail } from "../services/steamTypeManager.js";
import { categoryGroups } from "../structure/categorise.js";

/**
 * マルチプレイカテゴリを持つゲームのみを抽出した新しいMapを返す
 * 
 * 元のsteamDataMapは変更せず、
 * categoryGroups.multiPlay に含まれるカテゴリIDを
 * 1つ以上持つゲームのみを残す。
 * 
 * @param steamDataMap Steamゲーム詳細Map
 * @returns マルチプレイ対応ゲームのみを含むMap
 */
export function filterMultiplayerGames(steamDataMap: Map<number, ExtendedSteamGameDetail>): Map<number, ExtendedSteamGameDetail> {
    const set = new Set(categoryGroups.multiPlay);

    return new Map(
        [...steamDataMap].filter(([_, val]) =>
            val.steamDetail.categories?.some(x => set.has(x.id))
        )
    );
}