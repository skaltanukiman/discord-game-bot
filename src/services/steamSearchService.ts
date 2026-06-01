import { SteamStoreApp } from "./steamTypeManager.js";
import { normalizeSearchText } from "../formatter/textFormatter.js";

/**
 * Steamアプリ一覧から、指定されたキーワードに一致するアプリを検索する。
 *
 * 検索キーワードとアプリ名は正規化したうえで比較し、
 * アプリ名にキーワードが含まれるものを検索結果として返す。
 *
 * limit に 1 以上の値が指定されている場合は、検索結果を指定件数までに制限する。
 * limit が 0 以下の場合は、検索結果を切り捨てずにすべて返す。
 * キーワードが空の場合は検索を行わず、空配列を返す。
 *
 * @param apps 検索対象のSteamアプリ一覧
 * @param keyword 検索キーワード
 * @param limit 返却する最大件数。未指定の場合は10件。0以下の場合は件数制限なし
 * @returns キーワードに一致したSteamアプリ一覧
 */
export function searchSteamApps(apps: SteamStoreApp[], keyword: string, limit: number = 10): SteamStoreApp[] {
    const normalizedKeyword = normalizeSearchText(keyword);
    const safeLimit = Math.max(0, limit);

    if (!normalizedKeyword) {
        return [];
    }

    const filteredApps = apps.filter(app => {
        const normalizedName = normalizeSearchText(app.name);

        return normalizedName.includes(normalizedKeyword);
    });

    if (filteredApps.length > safeLimit && safeLimit > 0) {
        // limitが指定されている場合に、limit数以上の結果は切り捨てて返却する
        return filteredApps.slice(0, safeLimit);
    }

    return filteredApps;
}