import { describe, it, expect} from "vitest";
import { formatGenres } from "../src/formatter/steamDataFormatter.js";

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