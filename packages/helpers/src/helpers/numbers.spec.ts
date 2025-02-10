import { describe, expect, test } from 'vitest';

import { formatPercent, getPercentDiff } from '.';

describe('numbers', () => {
  test('formats percent', async () => {
    const nullPercent = null;
    const zeroPercent = 0;
    const positivePercent = 1;
    const negativePercent = -1;

    expect(formatPercent(nullPercent)).toBe('');
    expect(formatPercent(zeroPercent)).toBe('0%');
    expect(formatPercent(positivePercent)).toBe('+1%');
    expect(formatPercent(negativePercent)).toBe('-1%');
  });

  test('gets percent diff', async () => {
    const current = 4;
    const prev = 2;

    expect(getPercentDiff(current, prev)).toBe(50);
  });
});
