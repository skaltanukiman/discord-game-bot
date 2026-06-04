import { describe, expect, it } from "vitest";
import { searchSteamApps } from "../src/services/steamSearchService";
import type { SteamStoreApp } from "../src/services/steamTypeManager";

describe("searchSteamApps", () => {
    const apps: SteamStoreApp[] = [
        {
            appid: 100,
            name: "Monster Hunter Wilds"
        },
        {
            appid: 200,
            name: "Monster Hunter: World"
        },
        {
            appid: 300,
            name: "MONSTER HUNTER RISE"
        },
        {
            appid: 400,
            name: "Stardew Valley"
        },
        {
            appid: 500,
            name: "モンスターハンター ワイルズ"
        }
    ];

    it("キーワードに一致するSteamアプリを返す", () => {
        const result = searchSteamApps(apps, "Monster Hunter");

        expect(result).toEqual([
            {
                appid: 100,
                name: "Monster Hunter Wilds"
            },
            {
                appid: 200,
                name: "Monster Hunter: World"
            },
            {
                appid: 300,
                name: "MONSTER HUNTER RISE"
            }
        ]);
    });

    it("大文字小文字を区別せずに検索する", () => {
        const result = searchSteamApps(apps, "monster hunter");

        expect(result).toEqual([
            {
                appid: 100,
                name: "Monster Hunter Wilds"
            },
            {
                appid: 200,
                name: "Monster Hunter: World"
            },
            {
                appid: 300,
                name: "MONSTER HUNTER RISE"
            }
        ]);
    });

    it("空白を無視して検索する", () => {
        const result = searchSteamApps(apps, "MonsterHunter");

        expect(result).toEqual([
            {
                appid: 100,
                name: "Monster Hunter Wilds"
            },
            {
                appid: 200,
                name: "Monster Hunter: World"
            },
            {
                appid: 300,
                name: "MONSTER HUNTER RISE"
            }
        ]);
    });

    it("記号を無視して検索する", () => {
        const result = searchSteamApps(apps, "Monster-Hunter");

        expect(result).toEqual([
            {
                appid: 100,
                name: "Monster Hunter Wilds"
            },
            {
                appid: 200,
                name: "Monster Hunter: World"
            },
            {
                appid: 300,
                name: "MONSTER HUNTER RISE"
            }
        ]);
    });

    it("日本語のキーワードで検索する", () => {
        const result = searchSteamApps(apps, "モンスターハンター");

        expect(result).toEqual([
            {
                appid: 500,
                name: "モンスターハンター ワイルズ"
            }
        ]);
    });

    it("一致するアプリが存在しない場合、空配列を返す", () => {
        const result = searchSteamApps(apps, "Dragon Quest");

        expect(result).toEqual([]);
    });

    it("キーワードが空文字の場合、空配列を返す", () => {
        const result = searchSteamApps(apps, "");

        expect(result).toEqual([]);
    });

    it("キーワードが空白のみの場合、空配列を返す", () => {
        const result = searchSteamApps(apps, "   ");

        expect(result).toEqual([]);
    });

    it("limit が指定されている場合、検索結果を指定件数までに制限する", () => {
        const result = searchSteamApps(apps, "Monster Hunter", 2);

        expect(result).toEqual([
            {
                appid: 100,
                name: "Monster Hunter Wilds"
            },
            {
                appid: 200,
                name: "Monster Hunter: World"
            }
        ]);
    });

    it("limit が未指定の場合、検索結果を最大10件まで返す", () => {
        const manyApps: SteamStoreApp[] = Array.from({ length: 12 }, (_, index) => ({
            appid: index + 1,
            name: `Test Game ${index + 1}`
        }));

        const result = searchSteamApps(manyApps, "Test Game");

        expect(result).toHaveLength(10);
        expect(result).toEqual(manyApps.slice(0, 10));
    });

    it("limit が 0 の場合、検索結果を切り捨てずにすべて返す", () => {
        const result = searchSteamApps(apps, "Monster Hunter", 0);

        expect(result).toEqual([
            {
                appid: 100,
                name: "Monster Hunter Wilds"
            },
            {
                appid: 200,
                name: "Monster Hunter: World"
            },
            {
                appid: 300,
                name: "MONSTER HUNTER RISE"
            }
        ]);
    });

    it("limit が負数の場合、検索結果を切り捨てずにすべて返す", () => {
        const result = searchSteamApps(apps, "Monster Hunter", -1);

        expect(result).toEqual([
            {
                appid: 100,
                name: "Monster Hunter Wilds"
            },
            {
                appid: 200,
                name: "Monster Hunter: World"
            },
            {
                appid: 300,
                name: "MONSTER HUNTER RISE"
            }
        ]);
    });

    it("検索対象のSteamアプリ一覧が空の場合、空配列を返す", () => {
        const result = searchSteamApps([], "Monster Hunter");

        expect(result).toEqual([]);
    });
});