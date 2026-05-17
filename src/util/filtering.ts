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

/**
 * Mapから値をランダムに抽出し、指定件数分の配列として返す
 *
 * 元のMapや値の順序は変更しない（副作用なし）。
 *
 * countがMapの要素数を超える場合は、存在する全要素をそのまま返す。
 *
 * @param map ランダム抽出対象のMap
 * @param count 取得したい件数
 * @returns ランダムに選ばれた値の配列
 */
export function pickRandomvaluesFromMap<K, V>(map: Map<K, V>, count: number): V[] {
    if (map.size === 0 || count <= 0) {
        return [];
    }

    // Mapから値だけを取り出して配列化
    const values = Array.from(map.values());

    // 配列の要素をシャッフル
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [values[i], values[j]] = [values[j]!, values[i]!];
    }

    // 指定件数分切り出し、返却
    return values.slice(0, Math.min(count, values.length));
}