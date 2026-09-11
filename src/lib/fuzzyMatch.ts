function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;

  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = temp;
    }
  }
  return dp[n];
}

/** 0 (nothing alike) to 1 (identical), case/whitespace-insensitive. */
export function similarity(a: string, b: string): number {
  const x = a.toLowerCase().trim();
  const y = b.toLowerCase().trim();
  if (!x || !y) return 0;
  return 1 - levenshtein(x, y) / Math.max(x.length, y.length);
}

/** Best-scoring item for `query`, or null if nothing clears `threshold`. */
export function bestMatchWithScore<T>(
  query: string,
  items: T[],
  getText: (item: T) => string,
  threshold = 0.5
): { item: T; score: number } | null {
  let best: { item: T; score: number } | null = null;
  for (const item of items) {
    const score = similarity(query, getText(item));
    if (score >= threshold && (!best || score > best.score)) {
      best = { item, score };
    }
  }
  return best;
}
