import { ref } from 'vue';
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
});
