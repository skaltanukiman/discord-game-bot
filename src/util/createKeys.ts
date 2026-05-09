/**
 * 渡された値からJSON形式のキー文字列を生成します。
 * 
 * @param   values キー生成に使用する値
 * @returns JSON形式のキー文字列
 */
export function createKey(...values: any[]): string {
    return JSON.stringify(values);
}