import { describe, expect, it } from 'vitest';

import { formatPercent, getPercentDiff } from '..';

describe('numbers', () => {
  it('formats null percent', async () => {
    const nullPercent = null;

    expect(formatPercent(nullPercent)).toBe('');
  });

  it('formats zero percent', async () => {
    const zeroPercent = 0;

    expect(formatPercent(zeroPercent)).toBe('0%');
  });

  it('formats percent - positive value', async () => {
    const positivePercent = 1;

    expect(formatPercent(positivePercent)).toBe('+1%');
  });

  it('formats percent - negative value', async () => {
    const negativePercent = -1;

    expect(formatPercent(negativePercent)).toBe('-1%');
  });

  it('formats NaN percent', async () => {
    const nanPercent = Number.NaN;

    expect(formatPercent(nanPercent)).toBe('');
  });

  it('formats very large percent values', async () => {
    const largePercent = 1000;

    expect(formatPercent(largePercent)).toBe('+1000%');
  });

  it('formats negative large percent values', async () => {
    const largeNegativePercent = -1000;

    expect(formatPercent(largeNegativePercent)).toBe('-1000%');
  });

  it('gets percent diff - positive difference', async () => {
    const current = 4;
    const prev = 2;

    expect(getPercentDiff(current, prev)).toBe(100);
  });

  it('gets percent diff - negative difference', async () => {
    const current = 2;
    const prev = 4;

    expect(getPercentDiff(current, prev)).toBe(-50);
  });

  it('gets percent diff - zero difference', async () => {
    const current = 2;
    const prev = 2;

    expect(getPercentDiff(current, prev)).toBe(0);
  });

  it('gets percent diff - zero previous value', async () => {
    const current = 2;
    const prev = 0;

    expect(getPercentDiff(current, prev)).toBe(0);
  });

  it('gets percent diff - NaN values', async () => {
    const current = Number.NaN;
    const prev = 2;

    expect(getPercentDiff(current, prev)).toBe(0);
  });

  it('gets percent diff - very small difference', async () => {
    const current = 1.01;
    const prev = 1;

    expect(getPercentDiff(current, prev)).toBe(1);
  });

  it('gets percent diff - negative previous value', async () => {
    const current = 2;
    const prev = -4;

    expect(getPercentDiff(current, prev)).toBe(-150);
  });
});
