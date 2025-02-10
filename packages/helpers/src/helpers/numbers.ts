export function formatPercent(percent: number | null): string {
  return percent === null ? '' : `${percent > 0 ? `+` : ``}${percent}%`;
}

export function getPercentDiff(cur: number, prev: number): number {
  return Math.round(((cur - prev) / cur) * 100) || 0;
}
