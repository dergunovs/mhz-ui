export function formatPercent(percent: number | null): string {
  if (percent === null || isNaN(percent)) return '';

  return `${percent > 0 ? '+' : ''}${percent}%`;
}

export function getPercentDiff(cur: number, prev: number): number {
  if (prev === 0 || isNaN(prev) || isNaN(cur)) return 0;

  return Math.round(((cur - prev) / prev) * 100);
}
