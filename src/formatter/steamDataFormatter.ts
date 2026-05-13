import { ExtendedSteamGameDetail } from "../services/steamTypeManager.js";

/**
 * ゲームのジャンル一覧をカンマ区切り文字列へ整形する
 * 
 * Steam詳細情報からジャンル名を取得し、
 * 表示用の文字列として返す。
 * ジャンル情報が存在しない場合は undefined を返す。
 * 
 * @param game Steamゲーム詳細情報
 * @returns カンマ区切りのジャンル文字列
 */
export function formatGenres(game: ExtendedSteamGameDetail): string | undefined {
    return game.steamDetail.genres?.map(x => x.description).join(", ");
}