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
 * 指定されたカテゴリIDを持つSteamゲームを抽出する。
 *
 * 各ゲームの categories に、引数 categoryIds に含まれるカテゴリIDが
 * 1つでも存在する場合、そのゲームを抽出対象とする。
 *
 * categories が存在しないゲームは抽出対象外とする。
 *
 * @param steamData 抽出対象のSteamゲーム詳細データ配列
 * @param categoryIds 抽出条件となるSteamカテゴリID配列
 * @returns 指定カテゴリIDを持つSteamゲーム詳細データ配列
 */
function filterGamesByCategoryIds(steamData: ExtendedSteamGameDetail[], categoryIds: number[]): ExtendedSteamGameDetail[] {
    const set = new Set(categoryIds);

    return steamData.filter(game => 
        game.steamDetail.categories?.some(x => set.has(x.id)) ?? false
    );
}

/**
 * マルチプレイ対応のSteamゲームを抽出する。
 *
 * Steamカテゴリに、マルチプレイなど、
 * categoryGroups.multiPlay に定義されたカテゴリIDを持つゲームを抽出する。
 *
 * @param steamData 抽出対象のSteamゲーム詳細データ配列
 * @returns マルチプレイ対応のSteamゲーム詳細データ配列
 */
export function filterMultiplayerGamesArray(steamData: ExtendedSteamGameDetail[]): ExtendedSteamGameDetail[] {
    return filterGamesByCategoryIds(steamData, categoryGroups.multiPlay);
}

/**
 * シングルプレイ対応のSteamゲームを抽出する。
 *
 * Steamカテゴリに、categoryGroups.singlePlay に定義された
 * シングルプレイ系カテゴリIDを持つゲームを抽出する。
 *
 * なお、シングルプレイとマルチプレイの両方に対応しているゲームも
 * 抽出対象に含まれる。
 *
 * @param steamData 抽出対象のSteamゲーム詳細データ配列
 * @returns シングルプレイ対応のSteamゲーム詳細データ配列
 */
export function filterSingleplayerGamesArray(steamData: ExtendedSteamGameDetail[]): ExtendedSteamGameDetail[] {
    return filterGamesByCategoryIds(steamData, categoryGroups.singlePlay);
}

/**
 * シングルプレイ専用のSteamゲームを抽出する。
 *
 * シングルプレイ系カテゴリIDを持ち、かつマルチプレイ系カテゴリIDを
 * 持たないゲームのみを抽出する。
 *
 * そのため、Single-player と Multi-player の両方に対応しているゲームは
 * 抽出対象外となる。
 *
 * categories が存在しないゲームは、シングルプレイ判定ができないため
 * 抽出対象外とする。
 *
 * @param steamData 抽出対象のSteamゲーム詳細データ配列
 * @returns シングルプレイ専用のSteamゲーム詳細データ配列
 */
export function filterSingleplayerOnlyGamesArray(steamData: ExtendedSteamGameDetail[]): ExtendedSteamGameDetail[] {
    const singleSet = new Set(categoryGroups.singlePlay);
    const multiSet = new Set(categoryGroups.multiPlay);

    return steamData.filter(game => {
        const categories = game.steamDetail.categories ?? [];

        const hasSingle = categories.some(x => singleSet.has(x.id));
        const hasMulti = categories.some(x => multiSet.has(x.id));

        // シングルプレイのカテゴリを持っている物のみを抽出する
        return hasSingle && !hasMulti;
    });
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