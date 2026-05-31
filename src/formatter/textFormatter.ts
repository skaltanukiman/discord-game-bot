/**
 * 文字列からHTMLタグを除去する
 * 
 * <br> や <strong> 等のHTMLタグを削除し、
 * プレーンテキストへ変換する。
 * 
 * @param text HTMLタグを含む文字列
 * @returns HTMLタグを除去した文字列
 */
export function removeHtmlTag(text: string): string {
    return text.replace(/<[^>]+>/g, "");
}

/**
 * 検索用に文字列を正規化する
 *
 * - 大文字小文字を区別しない
 * - 空白を無視する
 * - 記号を無視する
 *
 * @param value 正規化対象の文字列
 * @returns 検索用に正規化した文字列
 */
export function normalizeSearchText(value: string): string {
    return value.toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
}