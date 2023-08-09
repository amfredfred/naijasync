export const wait = /*@devfred*/ async (seconds?: number) => new Promise((resolved) => setTimeout(() => resolved('continue'), Number(seconds) * 1000 || 1000))
