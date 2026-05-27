import { describe, it, expect} from "vitest";
import { formatGenres, formatCategories } from "../src/formatter/steamDataFormatter.js";

/**
 * formatGenres のテスト
 *
 * Steamゲーム詳細データの genres 配列から
 * ジャンル名をカンマ区切り文字列に変換できるかを確認する。
 */
describe("formatGenres", () => {
    it("ジャンル名をカンマ区切りで返す", () => {

        const game = {
            steamDetail: {
                genres: [
                    { id: "1", description: "Action" },
                    { id: "2", description: "Adventure" }
                ]
            }
        } as any;

        const result = formatGenres(game);

        expect(result).toBe("Action, Adventure");
    });


    it("genres が undefined の場合は undefined を返す", () => {
        const game = {
            steamDetail: {}
        } as any;

        const result = formatGenres(game);

        expect(result).toBeUndefined();
    });
});

/**
 * formatCategories のテスト
 *
 * Steamゲーム詳細データの categories 配列から
 * カテゴリ名をカンマ区切り文字列に変換できるかを確認する。
 */
describe("formatCategories", () => {
    it("カテゴリ名をカンマ区切りで返す", () => {
        const game = {
            steamDetail: {
                categories: [
                    { id: 1, description: "Multi-player" },
                    { id: 2, description: "Single-player" }
                ]
            }
        } as any;

        const result = formatCategories(game);

        expect(result).toBe("Multi-player, Single-player");
    });

    it("categories が undefined の場合は undefined を返す", () => {
        const game = {
            steamDetail: {}
        } as any;

        const result = formatCategories(game);

        expect(result).toBeUndefined();
    });
});