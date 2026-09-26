export function formatPercent(percent: number | null): string {
  if (percent === null || Number.isNaN(percent)) return '';

  return `${percent > 0 ? '+' : ''}${percent}%`;
}

export function getPercentDiff(cur: number, prev: number): number {
  if (Number.isNaN(prev) || Number.isNaN(cur)) return 0;

  if (prev === 0) {
    if (cur > 0) return 100;

    return cur < 0 ? -100 : 0;
  }

  return Math.round(((cur - prev) / prev) * 100);
}
