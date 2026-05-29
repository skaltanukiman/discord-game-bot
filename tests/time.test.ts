import { describe, expect, it, vi, afterEach } from "vitest";
import { isWithinMinutes } from "../src/util/timeUtil";

/**
 * isWithinMinutes のテスト
 */
describe("isWithinMinutes", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("指定分数以内の場合はtrueを返す", () => {
        vi.spyOn(Date, "now").mockReturnValue(new Date("2026-05-29T12:00:00").getTime());

        const previousTime = new Date("2026-05-29T11:55:01").getTime();

        const result = isWithinMinutes(previousTime, 5);

        expect(result).toBe(true);
    });

    it("指定分数を超えている場合はfalseを返す", () => {
        vi.spyOn(Date, "now").mockReturnValue(new Date("2026-05-29T12:00:00").getTime());

        const previousTime = new Date("2026-05-29T11:54:59").getTime();

        const result = isWithinMinutes(previousTime, 5);

        expect(result).toBe(false);
    });

    it("ちょうど指定分数の場合はfalseを返す", () => {
        vi.spyOn(Date, "now").mockReturnValue(new Date("2026-05-29T12:00:00").getTime());

        const previousTime = new Date("2026-05-29T11:55:00").getTime();

        const result = isWithinMinutes(previousTime, 5);

        expect(result).toBe(false);
    });

    it("limitMinutesが0の場合はfalseを返す", () => {
        vi.spyOn(Date, "now").mockReturnValue(new Date("2026-05-29T12:00:00").getTime());

        const previousTime = new Date("2026-05-29T12:00:00").getTime();

        const result = isWithinMinutes(previousTime, 0);

        expect(result).toBe(false);
    });
});