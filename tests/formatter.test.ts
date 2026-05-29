import { describe, it, expect} from "vitest";
import { formatGenres, formatCategories } from "../src/formatter/steamDataFormatter.js";
import { removeHtmlTag } from "../src/formatter/textFormatter.js";

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

/**
 * removeHtmlTag のテスト
 *
 * 渡された文字列に含まれているHTMLタグを削除し、
 * 文字列として返す
 */
describe("removeHtmlTag", () => {
    it("HTMLタグを除去できる", () => {
        const result = removeHtmlTag("<strong>日本語</strong>");

        expect(result).toBe("日本語");
    });

    it("brタグを除去できる", () => {
        const result = removeHtmlTag("日本語<br>対応");

        expect(result).toBe("日本語対応");
    });

    it("複数のHTMLタグを除去できる", () => {
        const result = removeHtmlTag("<p>Hello</p><strong>World</strong>");

        expect(result).toBe("HelloWorld");
    });

    it("属性付きHTMLタグを除去できる", () => {
        const result = removeHtmlTag('<span class="red">Action</span>');

        expect(result).toBe("Action");
    });

    it("HTMLタグが含まれていない場合はそのまま返す", () => {
        const result = removeHtmlTag("日本語対応");

        expect(result).toBe("日本語対応");
    });

    it("空文字の場合は空文字を返す", () => {
        const result = removeHtmlTag("");

        expect(result).toBe("");
    });
});