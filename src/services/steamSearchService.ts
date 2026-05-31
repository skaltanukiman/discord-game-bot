import { SteamStoreApp } from "./steamTypeManager.js";
import { normalizeSearchText } from "../formatter/textFormatter.js";
import { logger } from "../util/logger.js";

export function searchSteamApps(apps: SteamStoreApp[], keyword: string, limit: number = 10): SteamStoreApp[] {
    const normalizedKeyword = normalizeSearchText(keyword);
    const safeLimit = Math.max(0, limit);

    if (!normalizedKeyword || safeLimit === 0) {
        return [];
    }

    const filteredApps = apps.filter(app => {
        const normalizedName = normalizeSearchText(app.name);

        return normalizedName.includes(normalizedKeyword);
    });

    if (filteredApps.length > safeLimit) {
        logger.info(`検索結果が ${filteredApps.length} 件のため、一部の検索結果を切り捨てます`);
    }

    return filteredApps.slice(0, safeLimit);
}