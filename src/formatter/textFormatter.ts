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