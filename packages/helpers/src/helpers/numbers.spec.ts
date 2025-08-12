import { describe, expect, test } from 'vitest';

import { formatPercent, getPercentDiff } from '.';

describe('numbers', () => {
  test('formats null percent', async () => {
    const nullPercent = null;

    expect(formatPercent(nullPercent)).toBe('');
  });

  test('formats zero percent', async () => {
    const zeroPercent = 0;

    expect(formatPercent(zeroPercent)).toBe('0%');
  });

  test('formats percent - positive value', async () => {
    const positivePercent = 1;

    expect(formatPercent(positivePercent)).toBe('+1%');
  });

  test('formats percent - negative value', async () => {
    const negativePercent = -1;

    expect(formatPercent(negativePercent)).toBe('-1%');
  });

  test('formats NaN percent', async () => {
    const nanPercent = NaN;

    expect(formatPercent(nanPercent)).toBe('');
  });

  test('gets percent diff - positive difference', async () => {
    const current = 4;
    const prev = 2;

    expect(getPercentDiff(current, prev)).toBe(100);
  });

  test('gets percent diff - negative difference', async () => {
    const current = 2;
    const prev = 4;

    expect(getPercentDiff(current, prev)).toBe(-50);
  });

  test('gets percent diff - zero difference', async () => {
    const current = 2;
    const prev = 2;

    expect(getPercentDiff(current, prev)).toBe(0);
  });

  test('gets percent diff - zero previous value', async () => {
    const current = 2;
    const prev = 0;

    expect(getPercentDiff(current, prev)).toBe(0);
  });

  test('gets percent diff - NaN values', async () => {
    const current = NaN;
    const prev = 2;

    expect(getPercentDiff(current, prev)).toBe(0);
  });
});
