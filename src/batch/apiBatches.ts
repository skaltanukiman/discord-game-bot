/**
 * 指定した appid 群を一定数ずつ並列実行し、
 * 取得結果を1つのオブジェクトにまとめて返します。
 * 
 * batchSize ごとに Promise.all で並列処理を行うことで、
 * APIへの同時リクエスト数を制御。
 * 
 * 各処理結果は Object.assign により results にマージされます。
 * 空オブジェクト({})を返した場合は自動的に無視されます。
 * 
 * @template T 文字列appid をキーとしたレスポンス型
 * @param appids 処理対象の appid 配列
 * @param batchSize 同時実行する件数
 * @param fn appid ごとの非同期取得処理
 * @returns 取得結果を結合したオブジェクト
 */
export async function fetchInBatches<T extends Record<string, any>>(
    appids: number[],
    batchSize: number = 5,
    fn: (appid: number) => Promise<T>
) {
    const results: Record<string, any> = {};

    for (let i = 0; i < appids.length; i += batchSize) {
        const batch = appids.slice(i, i + batchSize);

        const batchResults = await Promise.all(
            batch.map(appid => fn(appid))
        );

        for (const r of batchResults) {
            Object.assign(results, r);           
        }
    }

    return results;
}