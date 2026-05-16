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