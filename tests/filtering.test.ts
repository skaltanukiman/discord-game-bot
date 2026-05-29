import { describe, expect, it, vi, afterEach } from "vitest";
import { filterMultiplayerGames, pickRandomvaluesFromMap  } from "../src/util/filtering";
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