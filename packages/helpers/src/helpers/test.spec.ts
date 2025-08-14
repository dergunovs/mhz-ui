import { vi, describe, expect, test } from 'vitest';

import { dataTest, removeDataTest, wait, withSetup } from '.';

describe('test', () => {
  test('returns data test element - basic functionality', async () => {
    const formSelector = `[data-test="form"]`;

    expect(dataTest('form')).toStrictEqual(formSelector);
  });

  test('returns data test element - different values', async () => {
    expect(dataTest('button')).toStrictEqual(`[data-test="button"]`);
    expect(dataTest('input')).toStrictEqual(`[data-test="input"]`);
    expect(dataTest('modal')).toStrictEqual(`[data-test="modal"]`);
  });

  test('removes data test attribute - element with data-test', async () => {
    const node = {
      type: 1, // NodeTypes.ELEMENT
      props: [
        { type: 6, name: 'data-test', value: 'test-value' },
        { type: 7, name: 'class', value: 'some-class' },
      ],
    };

    removeDataTest(node);

    expect(node.props).toHaveLength(1);
    expect(node.props[0].name).toBe('class');
  });

  test('removes data test attribute - element without data-test', async () => {
    const node = {
      type: 1, // NodeTypes.ELEMENT
      props: [
        { type: 7, name: 'class', value: 'some-class' },
        { type: 8, name: 'id', value: 'test-id' },
      ],
    };

    removeDataTest(node);

    expect(node.props).toHaveLength(2);
    expect(node.props[0].name).toBe('class');
    expect(node.props[1].name).toBe('id');
  });

  test('removes data test attribute - non-element node', async () => {
    const node = {
      type: 2, // NodeTypes.TEXT
      props: [{ type: 6, name: 'data-test', value: 'test-value' }],
    };

    removeDataTest(node);

    expect(node.props).toHaveLength(1);
    expect(node.props[0].name).toBe('data-test');
  });

  test('waits for timeout', async () => {
    const fn = vi.fn();

    function timeoutedFunction() {
      setTimeout(() => {
        fn();
      }, 100);
    }

    timeoutedFunction();

    expect(fn).toHaveBeenCalledTimes(0);

    await wait(50);

    expect(fn).toHaveBeenCalledTimes(0);

    await wait(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('waits for timeout without time argument', async () => {
    const fn = vi.fn();

    function timeoutedFunction() {
      setTimeout(() => {
        fn();
      }, 8);
    }

    timeoutedFunction();

    expect(fn).toHaveBeenCalledTimes(0);

    await wait();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('withSetup function', async () => {
    const mockComposable = vi.fn();

    expect(() => withSetup(mockComposable)).not.toThrow();
  });
});
