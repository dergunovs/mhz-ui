import { ref } from 'vue';
import { describe, expect, test } from 'vitest';

import { clone } from '.';

describe('clone', () => {
  test('clones object', async () => {
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

  test('clones ref object', async () => {
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

  test('clones primitive values', async () => {
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

  test('clones array', async () => {
    const arr = [1, 2, 3, { id: 1, name: 'test' }];
    const clonedArr = clone(arr);

    expect(clonedArr).toStrictEqual(arr);
    expect(clonedArr).not.toBe(arr);
  });
});
