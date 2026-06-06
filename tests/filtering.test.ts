import { describe, expect, it, vi, afterEach } from "vitest";
import { filterMultiplayerGames, pickRandomvaluesFromMap, filterMultiplayerGamesArray, filterSingleplayerGamesArray, filterSingleplayerOnlyGamesArray } from "../src/util/filtering";
import type { ExtendedSteamGameDetail } from "../src/services/steamTypeManager";

/**
 * filterMultiplayerGames のテスト
 */
describe("filterMultiplayerGames", () => {
    it("マルチプレイカテゴリを持つゲームのみ抽出できる", () => {
        const steamDataMap = new Map<number, ExtendedSteamGameDetail>([
            [
                1,
                {
                    steamDetail: {
                        categories: [
                            { id: 1, description: "Multi-player" }
                        ]
                    }
                } as ExtendedSteamGameDetail
            ],
            [
                2,
                {
                    steamDetail: {
                        categories: [
                            { id: 2, description: "Single-player" }
                        ]
                    }
                } as ExtendedSteamGameDetail
            ]
        ]);

        const result = filterMultiplayerGames(steamDataMap);

        expect(result.size).toBe(1);
        expect(result.has(1)).toBe(true);
        expect(result.has(2)).toBe(false);
    });

    it("複数カテゴリの中にマルチプレイカテゴリが含まれていれば抽出できる", () => {
        const steamDataMap = new Map<number, ExtendedSteamGameDetail>([
            [
                1,
                {
                    steamDetail: {
                        categories: [
                            { id: 2, description: "Single-player" },
                            { id: 1, description: "Multi-player" }
                        ]
                    }
                } as ExtendedSteamGameDetail
            ]
        ]);

        const result = filterMultiplayerGames(steamDataMap);

        expect(result.size).toBe(1);
        expect(result.has(1)).toBe(true);
    });

    it("categoriesがundefinedの場合は抽出されない", () => {
        const steamDataMap = new Map<number, ExtendedSteamGameDetail>([
            [
                1,
                {
                    steamDetail: {
                        categories: undefined
                    }
                } as ExtendedSteamGameDetail
            ]
        ]);

        const result = filterMultiplayerGames(steamDataMap);

        expect(result.size).toBe(0);
    });

    it("マルチプレイカテゴリを持つゲームがない場合は空のMapを返す", () => {
        const steamDataMap = new Map<number, ExtendedSteamGameDetail>([
            [
                1,
                {
                    steamDetail: {
                        categories: [
                            { id: 2, description: "Single-player" }
                        ]
                    }
                } as ExtendedSteamGameDetail
            ]
        ]);

        const result = filterMultiplayerGames(steamDataMap);

        expect(result.size).toBe(0);
        expect(result).toBeInstanceOf(Map);
    });

    it("元のMapは変更しない", () => {
        const steamDataMap = new Map<number, ExtendedSteamGameDetail>([
            [
                1,
                {
                    steamDetail: {
                        categories: [
                            { id: 1, description: "Multi-player" }
                        ]
                    }
                } as ExtendedSteamGameDetail
            ],
            [
                2,
                {
                    steamDetail: {
                        categories: [
                            { id: 2, description: "Single-player" }
                        ]
                    }
                } as ExtendedSteamGameDetail
            ]
        ]);

        const result = filterMultiplayerGames(steamDataMap);

        expect(result.size).toBe(1);
        expect(steamDataMap.size).toBe(2);
    });

    it("空のMapを渡した場合は空のMapを返す", () => {
        const steamDataMap = new Map<number, ExtendedSteamGameDetail>();

        const result = filterMultiplayerGames(steamDataMap);

        expect(result.size).toBe(0);
        expect(result).toBeInstanceOf(Map);
    });
});

/**
 * pickRandomvaluesFromMap のテスト
 */
describe("pickRandomvaluesFromMap", () => {

    // 一つ一つのテストが終わるたびにモックとして固定した値等をリセットする
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Mapから指定件数分の値をランダムに抽出できる", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);

        const map = new Map<number, string>([
            [1, "A"],
            [2, "B"],
            [3, "C"],
        ]);

        const result = pickRandomvaluesFromMap(map, 2);

        expect(result).toHaveLength(2);
        expect(result).toEqual(["B", "C"]);
    });

    it("countがMapの要素数を超える場合は全要素を返す", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);

        const map = new Map<number, string>([
            [1, "A"],
            [2, "B"],
        ]);

        const result = pickRandomvaluesFromMap(map, 5);

        expect(result).toHaveLength(2);
        expect(result).toEqual(["B", "A"]);
    });

    it("空のMapを渡した場合は空配列を返す", () => {
        const map = new Map<number, string>();

        const result = pickRandomvaluesFromMap(map, 3);

        expect(result).toEqual([]);
    });

    it("countが0の場合は空配列を返す", () => {
        const map = new Map<number, string>([
            [1, "A"],
            [2, "B"],
        ]);

        const result = pickRandomvaluesFromMap(map, 0);

        expect(result).toEqual([]);
    });

    it("countが負数の場合は空配列を返す", () => {
        const map = new Map<number, string>([
            [1, "A"],
            [2, "B"],
        ]);

        const result = pickRandomvaluesFromMap(map, -1);

        expect(result).toEqual([]);
    });

    it("元のMapは変更しない", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);

        const map = new Map<number, string>([
            [1, "A"],
            [2, "B"],
            [3, "C"],
        ]);

        const before = Array.from(map.entries());

        pickRandomvaluesFromMap(map, 2);

        expect(Array.from(map.entries())).toEqual(before);
    });

    it("戻り値はMapの値のみを含む", () => {
        const map = new Map<number, string>([
            [1, "A"],
            [2, "B"],
            [3, "C"],
        ]);

        const result = pickRandomvaluesFromMap(map, 2);

        expect(result.every(x => Array.from(map.values()).includes(x))).toBe(true);
    });
});

/**
 * Steamゲーム詳細データのプレイ種別フィルタリング処理のテスト
 *
 * SteamカテゴリIDをもとに、
 * シングルプレイ対応、マルチプレイ対応、シングルプレイ専用の
 * ゲームを正しく抽出できるかを確認する。
 */
describe("Steamゲーム詳細データのプレイ種別フィルタリング", () => {
    const singleplayerGame = createGameDetail(100, "Single Game", [{ id: 2, description: "Single-player" }]);
    const multiplayerGame = createGameDetail(200, "Multi Game", [{ id: 1, description: "Multi-player" }]);
    const singleAndMultiGame = createGameDetail(300, "Single And Multi Game", [
        { id: 2, description: "Single-player" },
        { id: 1, description: "Multi-player" }
    ]);

    const noCategoriesGame = createGameDetail(400, "No Categories Game");

    const gameDetails: ExtendedSteamGameDetail[] = [
        singleplayerGame,
        multiplayerGame,
        singleAndMultiGame,
        noCategoriesGame
    ];

    describe("filterMultiplayerGamesArray", () => {
        it("マルチプレイ系カテゴリIDを持つゲームのみを抽出する", () => {
            const result = filterMultiplayerGamesArray(gameDetails);

            expect(result).toEqual([
                multiplayerGame,
                singleAndMultiGame
            ]);
        });

        it("categories が存在しないゲームは抽出対象外とする", () => {
            const result = filterMultiplayerGamesArray([
                noCategoriesGame
            ]);

            expect(result).toEqual([]);
        });

        it("抽出対象データが空配列の場合、空配列を返す", () => {
            const result = filterMultiplayerGamesArray([]);

            expect(result).toEqual([]);
        });
    });

    describe("filterSingleplayerGamesArray", () => {
        it("シングルプレイ系カテゴリIDを持つゲームを抽出する", () => {
            const result = filterSingleplayerGamesArray(gameDetails);

            expect(result).toEqual([
                singleplayerGame,
                singleAndMultiGame
            ]);
        });

        it("シングルプレイとマルチプレイの両方に対応しているゲームも抽出対象に含める", () => {
            const result = filterSingleplayerGamesArray([
                singleAndMultiGame
            ]);

            expect(result).toEqual([
                singleAndMultiGame
            ]);
        });

        it("categories が存在しないゲームは抽出対象外とする", () => {
            const result = filterSingleplayerGamesArray([
                noCategoriesGame
            ]);

            expect(result).toEqual([]);
        });

        it("抽出対象データが空配列の場合、空配列を返す", () => {
            const result = filterSingleplayerGamesArray([]);

            expect(result).toEqual([]);
        });
    });

    describe("filterSingleplayerOnlyGamesArray", () => {
        it("シングルプレイ系カテゴリIDを持ち、マルチプレイ系カテゴリIDを持たないゲームのみを抽出する", () => {
            const result = filterSingleplayerOnlyGamesArray(gameDetails);

            expect(result).toEqual([
                singleplayerGame
            ]);
        });

        it("シングルプレイとマルチプレイの両方に対応しているゲームは抽出対象外とする", () => {
            const result = filterSingleplayerOnlyGamesArray([
                singleAndMultiGame
            ]);

            expect(result).toEqual([]);
        });

        it("マルチプレイ系カテゴリIDのみを持つゲームは抽出対象外とする", () => {
            const result = filterSingleplayerOnlyGamesArray([
                multiplayerGame
            ]);

            expect(result).toEqual([]);
        });

        it("categories が存在しないゲームは抽出対象外とする", () => {
            const result = filterSingleplayerOnlyGamesArray([
                noCategoriesGame
            ]);

            expect(result).toEqual([]);
        });

        it("抽出対象データが空配列の場合、空配列を返す", () => {
            const result = filterSingleplayerOnlyGamesArray([]);

            expect(result).toEqual([]);
        });
    });

});

function createGameDetail(appid: number, name: string, categories?: { id: number; description: string}[]): ExtendedSteamGameDetail {
    return {
        steamDetail: {
            type: "game",
            name,
            steam_appid: appid,
            is_free: false,
            categories
        }
    };
}