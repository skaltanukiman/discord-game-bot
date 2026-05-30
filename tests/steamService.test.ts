import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

import { fetchAllSteamGames } from "../src/services/steamService";
import { setTimeout as wait } from "timers/promises";
import { logger } from "../src/util/logger";

vi.mock("axios");

vi.mock("timers/promises", () => ({
    setTimeout: vi.fn()
}));

vi.mock("../src/util/logger", () => ({
    logger: {
        error: vi.fn()
    }
}));

vi.mock("../src/config/env", () => ({
    env: {
        steamApiKey: "dummy-steam-api-key"
    }
}));

const mockedAxios = vi.mocked(axios);
const mockedWait = vi.mocked(wait);

/**
 * fetchAllSteamGames のテスト
 *
 * Steam Store に登録されているゲーム一覧を取得する処理について、
 * 通常取得・ページング・空レスポンス・異常系の挙動を確認する。
 */
describe("fetchAllSteamGames", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("Steam Store上のゲーム一覧を1ページ分取得できる", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                response: {
                    apps: [
                        {
                            appid: 730,
                            name: "Counter-Strike 2",
                            last_modified: 1234567890,
                            price_change_number: 100
                        },
                        {
                            appid: 570,
                            name: "Dota 2",
                            last_modified: 1234567891,
                            price_change_number: 101
                        }
                    ],
                    have_more_results: false,
                    last_appid: 570
                }
            }
        });

        const result = await fetchAllSteamGames();

        expect(result).toEqual([
            {
                appid: 730,
                name: "Counter-Strike 2",
                last_modified: 1234567890,
                price_change_number: 100
            },
            {
                appid: 570,
                name: "Dota 2",
                last_modified: 1234567891,
                price_change_number: 101
            }
        ]);

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            "https://api.steampowered.com/IStoreService/GetAppList/v1/",
            {
                params: {
                    key: "dummy-steam-api-key",
                    include_games: true,
                    include_dlc: false,
                    include_software: false,
                    include_videos: false,
                    include_hardware: false,
                    max_results: 50000
                }
            }
        );

        expect(mockedWait).not.toHaveBeenCalled();
    });

    it("have_more_results が true の場合、last_appid を使って次ページを取得する", async () => {
        mockedAxios.get
            .mockResolvedValueOnce({
                data: {
                    response: {
                        apps: [
                            {
                                appid: 100,
                                name: "Game A",
                                last_modified: 111,
                                price_change_number: 1
                            }
                        ],
                        have_more_results: true,
                        last_appid: 100
                    }
                }
            })
            .mockResolvedValueOnce({
                data: {
                    response: {
                        apps: [
                            {
                                appid: 200,
                                name: "Game B",
                                last_modified: 222,
                                price_change_number: 2
                            }
                        ],
                        have_more_results: false,
                        last_appid: 200
                    }
                }
            });

        const result = await fetchAllSteamGames();

        expect(result).toEqual([
            {
                appid: 100,
                name: "Game A",
                last_modified: 111,
                price_change_number: 1
            },
            {
                appid: 200,
                name: "Game B",
                last_modified: 222,
                price_change_number: 2
            }
        ]);

        expect(mockedAxios.get).toHaveBeenCalledTimes(2);

        expect(mockedAxios.get).toHaveBeenNthCalledWith(
            1,
            "https://api.steampowered.com/IStoreService/GetAppList/v1/",
            {
                params: {
                    key: "dummy-steam-api-key",
                    include_games: true,
                    include_dlc: false,
                    include_software: false,
                    include_videos: false,
                    include_hardware: false,
                    max_results: 50000
                }
            }
        );

        expect(mockedAxios.get).toHaveBeenNthCalledWith(
            2,
            "https://api.steampowered.com/IStoreService/GetAppList/v1/",
            {
                params: {
                    key: "dummy-steam-api-key",
                    include_games: true,
                    include_dlc: false,
                    include_software: false,
                    include_videos: false,
                    include_hardware: false,
                    max_results: 50000,
                    last_appid: 100
                }
            }
        );

        expect(mockedWait).toHaveBeenCalledTimes(1);
    });

    it("apps が undefined の場合でも空配列として扱う", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                response: {
                    apps: undefined,
                    have_more_results: false,
                    last_appid: undefined
                }
            }
        });

        const result = await fetchAllSteamGames();

        expect(result).toEqual([]);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it("have_more_results が true でも last_appid が null の場合はループを終了する", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                response: {
                    apps: [
                        {
                            appid: 100,
                            name: "Game A",
                            last_modified: 111,
                            price_change_number: 1
                        }
                    ],
                    have_more_results: true,
                    last_appid: null
                }
            }
        });

        const result = await fetchAllSteamGames();

        expect(result).toEqual([
            {
                appid: 100,
                name: "Game A",
                last_modified: 111,
                price_change_number: 1
            }
        ]);

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedWait).not.toHaveBeenCalled();
    });

    it("API取得でエラーが発生した場合、ログ出力して例外を投げる", async () => {
        const error = new Error("Steam API Error");

        mockedAxios.get.mockRejectedValueOnce(error);

        await expect(fetchAllSteamGames()).rejects.toThrow("Steam API Error");

        expect(logger.error).toHaveBeenCalledWith(
            "Steamゲーム一覧取得APIエラー",
            error
        );
    });
});