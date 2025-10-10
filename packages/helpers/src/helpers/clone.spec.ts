import { ref, reactive } from 'vue';
import { describe, expect, it } from 'vitest';

import { clone } from '.';

describe('clone', () => {
  it('clones object', async () => {
    const obj = {
      value: {
        inner: [
          { id: 1, title: 'text', image: { url: '/image.jpg' } },
          { id: 2, title: 'text', image: { url: '/image.jpg' } },
        ],
      },
    };

    const clonedObject = clone(obj);

    expect(clonedObject).toStrictEqual(obj);
  });

  it('clones ref object', async () => {
    const obj = ref({
      value: {
        inner: [
          { id: 1, title: 'text', image: { url: '/image.jpg' } },
          { id: 2, title: 'text', image: { url: '/image.jpg' } },
        ],
      },
    });

    const rawData = JSON.stringify(obj.value);

    const clonedObject = clone(rawData);

    expect(clonedObject).toStrictEqual(rawData);
  });

  it('clones primitive values', async () => {
    const stringVal = 'test';
    const numberVal = 42;
    const booleanVal = true;
    const nullVal = null;
    const undefinedVal = undefined;

    expect(clone(stringVal)).toStrictEqual(stringVal);
    expect(clone(numberVal)).toStrictEqual(numberVal);
    expect(clone(booleanVal)).toStrictEqual(booleanVal);
    expect(clone(nullVal)).toStrictEqual(nullVal);
    expect(clone(undefinedVal)).toStrictEqual(undefinedVal);
  });

  it('clones array', async () => {
    const arr = [1, 2, 3, { id: 1, name: 'test' }];
    const clonedArr = clone(arr);

    expect(clonedArr).toStrictEqual(arr);
    expect(clonedArr).not.toBe(arr);
  });

  it('clones empty object', async () => {
    const emptyObj = {};
    const clonedEmptyObj = clone(emptyObj);

    expect(clonedEmptyObj).toStrictEqual(emptyObj);
    expect(clonedEmptyObj).not.toBe(emptyObj);
  });

  it('clones empty array', async () => {
    const emptyArr: never[] = [];
    const clonedEmptyArr = clone(emptyArr);

    expect(clonedEmptyArr).toStrictEqual(emptyArr);
    expect(clonedEmptyArr).not.toBe(emptyArr);
  });

  it('clones date object', async () => {
    const date = new Date('2025-01-01');
    const clonedDate = clone(date);

    expect(clonedDate).toStrictEqual(date);
    expect(clonedDate).not.toBe(date);
  });

  it('handles null input', async () => {
    const clonedNull = clone(null);

    expect(clonedNull).toBeNull();
  });

  it('handles undefined input', async () => {
    const clonedUndefined = clone(undefined);

    expect(clonedUndefined).toBeUndefined();
  });

  it('clones RegExp object', async () => {
    const regex = /test/gi;
    const clonedRegex = clone(regex);

    expect(clonedRegex).toStrictEqual(regex);
    expect(clonedRegex).not.toBe(regex);
    expect(clonedRegex.source).toBe(regex.source);
    expect(clonedRegex.flags).toBe(regex.flags);
  });

  it('clones Set object', async () => {
    const originalSet = new Set([1, 2, 3, { id: 1 }]);
    const clonedSet = clone(originalSet);

    expect(clonedSet).toStrictEqual(originalSet);
    expect(clonedSet).not.toBe(originalSet);
    expect(clonedSet.has(1)).toBe(true);
    expect(clonedSet.has(2)).toBe(true);
    expect(clonedSet.has(3)).toBe(true);
  });

  it('clones Map object', async () => {
    const originalMap = new Map<string | number, string | { id: number }>([
      ['key1', 'value1'],
      ['key2', { id: 2 }],
      [42, 'number key'],
    ]);
    const clonedMap = clone(originalMap);

    expect(clonedMap).toStrictEqual(originalMap);
    expect(clonedMap).not.toBe(originalMap);
    expect(clonedMap.get('key1')).toBe('value1');
    expect(clonedMap.get('key2')).toStrictEqual({ id: 2 });
    expect(clonedMap.get(42)).toBe('number key');
  });

  it('clones object with symbols', async () => {
    const symbolKey = Symbol('test');
    const obj = {
      [symbolKey]: 'symbol value',
      regularProp: 'regular value',
      nested: {
        [symbolKey]: 'nested symbol',
      },
    };

    const clonedObj = clone(obj);

    expect(clonedObj).toStrictEqual(obj);
    expect(clonedObj).not.toBe(obj);
    expect(clonedObj[symbolKey]).toBe('symbol value');
    expect(clonedObj.regularProp).toBe('regular value');
    expect(clonedObj.nested[symbolKey]).toBe('nested symbol');
  });

  it('clones Vue reactive object', async () => {
    const originalObj = reactive({
      count: 0,
      nested: {
        value: 'test',
      },
    });

    const clonedObj = clone(originalObj);

    expect(clonedObj).toStrictEqual(originalObj);
    expect(clonedObj).not.toBe(originalObj);
    expect(clonedObj.count).toBe(0);
    expect(clonedObj.nested.value).toBe('test');
  });

  it('handles function input', async () => {
    const func = () => 'test';
    const clonedFunc = clone(func);

    expect(clonedFunc).toBe(func);
  });

  it('clones complex nested structure', async () => {
    const complexObj = {
      string: 'test',
      number: 42,
      boolean: true,
      date: new Date('2025-01-01'),
      regex: /hello/i,
      array: [1, 'string', { nested: true }, new Date('2024-01-01')],
      set: new Set([1, 2, 3]),
      map: new Map([['key', 'value']]),
      nested: {
        deep: {
          value: 'deep nested',
        },
      },
    };

    const clonedObj = clone(complexObj);

    expect(clonedObj).toStrictEqual(complexObj);
    expect(clonedObj).not.toBe(complexObj);
    expect(clonedObj.date).not.toBe(complexObj.date);
    expect(clonedObj.regex).not.toBe(complexObj.regex);
    expect(clonedObj.array[3]).not.toBe(complexObj.array[3]);
  });

  it('clones array with different types', async () => {
    const arr = ['string', 42, true, null, undefined, new Date('2025-01-01'), { object: true }, [1, 2, 3]];

    const clonedArr = clone(arr);

    expect(clonedArr).toStrictEqual(arr);
    expect(clonedArr).not.toBe(arr);
    expect(clonedArr[5]).not.toBe(arr[5]);
    expect(clonedArr[6]).not.toBe(arr[6]);
    expect(clonedArr[7]).not.toBe(arr[7]);
  });

  it('handles empty Set and Map', async () => {
    const emptySet = new Set();
    const emptyMap = new Map();

    const clonedSet = clone(emptySet);
    const clonedMap = clone(emptyMap);

    expect(clonedSet).toStrictEqual(emptySet);
    expect(clonedMap).toStrictEqual(emptyMap);
    expect(clonedSet).not.toBe(emptySet);
    expect(clonedMap).not.toBe(emptyMap);
  });

  it('clones Set with complex objects', async () => {
    const complexSet = new Set([{ id: 1, data: 'test' }, [1, 2, 3], new Date('2025-01-01')]);

    const clonedSet = clone(complexSet);

    expect(clonedSet).toStrictEqual(complexSet);
    expect(clonedSet).not.toBe(complexSet);

    const originalArray = [...complexSet].find((item) => Array.isArray(item));
    const clonedArray = [...clonedSet].find((item) => Array.isArray(item));

    expect(clonedArray).not.toBe(originalArray);
  });
});
