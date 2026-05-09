/**
 * 現在時刻と指定時刻との差が、指定分数以内かを判定する
 * 
 * @param previousTime 比較対象の時刻（ミリ秒）
 * @param limitMinutes 許容する経過時間（分）
 * @returns 指定時間以内の場合は true、それ以外は false
 */
export function isWithinMinutes(previousTime: number, limitMinutes: number) {
    const ONE_MINUTE_MS = 1000 * 60;  // 1分

    const currentTime = Date.now();
    const elapsedTime = currentTime - previousTime;  // 時間差異（経過時間）

    return elapsedTime < ONE_MINUTE_MS * limitMinutes;
}