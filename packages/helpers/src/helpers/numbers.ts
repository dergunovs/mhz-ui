export function formatPercent(percent: number | null): string {
  return percent === null ? '' : `${percent > 0 ? `+` : ``}${percent}%`;
}

export function getPercentDiff(cur: number, prev: number): number {
  return Math.round(((cur - prev) / prev) * 100) || 0;
}
