import { SteamStoreApp } from "./steamTypeManager.js";
import { normalizeSearchText } from "../formatter/textFormatter.js";

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