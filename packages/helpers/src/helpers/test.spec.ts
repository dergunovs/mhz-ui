import { vi, describe, expect, test } from 'vitest';

import { dataTest, wait } from './index.js';

describe('test', () => {
  test('returns data test element', async () => {
    const form = `[data-test="form"]`;

    expect(dataTest('form')).toStrictEqual(form);
  });

  test('waits for timeout', async () => {
    const fn = vi.fn();

    function timeoutedFunction() {
      setTimeout(() => {
        fn();
      }, 500);
    }

    timeoutedFunction();

    expect(fn).toHaveBeenCalledTimes(0);

    await wait(100);

    expect(fn).toHaveBeenCalledTimes(0);

    await wait(500);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
