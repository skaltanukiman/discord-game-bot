import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs/promises";
import { saveSteamStoreCache, getCachedAllSteamGames } from "../src/state/cacheManager";
import { getAllSteamGames } from "../src/services/steamService";
import { fetchAllSteamGames } from "../src/services/steamApiService";

/**
 * Steam Store キャッシュ処理のテスト
 *
 * Steam Store アプリ一覧キャッシュの保存・読込・有効期限判定・
 * API取得へのフォールバックが正しく動作するかを確認する。
 */
vi.mock("fs/promises", () => ({
    default: {
        mkdir: vi.fn(),
        writeFile: vi.fn(),
        readFile: vi.fn()
    }
}));

vi.mock("../src/services/steamApiService", () => ({
    fetchAllSteamGames: vi.fn()
}));

vi.mock("../src/util/logger", () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

describe("saveSteamStoreCache", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(Date, "now").mockReturnValue(1000);
    });

    it("Steam Store アプリ一覧を cachedAt 付きでJSONファイルへ保存できる", async () => {
        const filepath = "cache/steam-games.json";

        const data = [
            { appid: 10, name: "Counter-Strike" },
            { appid: 20, name: "Team Fortress Classic" }
        ];

        await saveSteamStoreCache(filepath, data);

        expect(fs.mkdir).toHaveBeenCalledWith(
            expect.any(String),
            { recursive: true }
        );

        expect(fs.writeFile).toHaveBeenCalledWith(
            filepath,
            JSON.stringify(
                {
                    cachedAt: 1000,
                    data
                },
                null,
                2
            ),
            "utf-8"
        );
    });
});

describe("getCachedAllSteamGames", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("有効期限内のキャッシュが存在する場合、キャッシュデータを返す", async () => {
        vi.spyOn(Date, "now").mockReturnValue(2000);

        const cachedData = [
            { appid: 10, name: "Counter-Strike" }
        ];

        vi.mocked(fs.readFile).mockResolvedValue(
            JSON.stringify({
                cachedAt: 1000,
                data: cachedData
            })
        );

        const result = await getCachedAllSteamGames();

        expect(result).toEqual(cachedData);
    });

    it("キャッシュファイルが存在しない場合、空配列を返す", async () => {
        vi.mocked(fs.readFile).mockRejectedValue(new Error("file not found"));

        const result = await getCachedAllSteamGames();

        expect(result).toEqual([]);
    });

    it("キャッシュファイルのJSONが壊れている場合、空配列を返す", async () => {
        vi.mocked(fs.readFile).mockResolvedValue("{ invalid json");

        const result = await getCachedAllSteamGames();

        expect(result).toEqual([]);
    });

    it("キャッシュの有効期限が切れている場合、空配列を返す", async () => {
        const now = 1000 * 60 * 60 * 24 * 10;  // 10日分の時間を表した数値
        vi.spyOn(Date, "now").mockReturnValue(now);

        const cachedData = [
            { appid: 10, name: "Counter-Strike" }
        ];

        vi.mocked(fs.readFile).mockResolvedValue(
            JSON.stringify({
                cachedAt: 1,
                data: cachedData
            })
        );

        const result = await getCachedAllSteamGames();

        expect(result).toEqual([]);
    });
});

describe("getAllSteamGames", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("有効なキャッシュがある場合、APIを呼ばずにキャッシュを返す", async () => {
        vi.spyOn(Date, "now").mockReturnValue(2000);

        const cachedData = [
            { appid: 10, name: "Counter-Strike" }
        ];

        vi.mocked(fs.readFile).mockResolvedValue(
            JSON.stringify({
                cachedAt: 1000,
                data: cachedData
            })
        );

        const result = await getAllSteamGames();

        expect(result).toEqual(cachedData);
        expect(fetchAllSteamGames).not.toHaveBeenCalled();
        expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it("有効なキャッシュがない場合、APIから取得してキャッシュに保存する", async () => {
        vi.mocked(fs.readFile).mockRejectedValue(new Error("file not found"));

        const apiData = [
            { appid: 20, name: "Team Fortress Classic" }
        ];

        vi.mocked(fetchAllSteamGames).mockResolvedValue(apiData);

        const result = await getAllSteamGames();

        expect(fetchAllSteamGames).toHaveBeenCalled();
        expect(fs.writeFile).toHaveBeenCalled();
        expect(result).toEqual(apiData);
    });

    it("キャッシュ保存に失敗しても、API取得結果を返す", async () => {
        vi.mocked(fs.readFile).mockRejectedValue(new Error("file not found"));

        const apiData = [
            { appid: 30, name: "Day of Defeat" }
        ];

        vi.mocked(fetchAllSteamGames).mockResolvedValue(apiData);
        vi.mocked(fs.writeFile).mockRejectedValue(new Error("write error"));

        const result = await getAllSteamGames();

        expect(result).toEqual(apiData);
    });

    it("API取得に失敗した場合、空配列を返す", async () => {
        vi.mocked(fs.readFile).mockRejectedValue(new Error("file not found"));
        vi.mocked(fetchAllSteamGames).mockRejectedValue(new Error("api error"));

        const result = await getAllSteamGames();

        expect(result).toEqual([]);
    });
});