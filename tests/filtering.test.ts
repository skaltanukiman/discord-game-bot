import { describe, expect, it } from "vitest";
import { filterMultiplayerGames } from "../src/util/filtering";
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