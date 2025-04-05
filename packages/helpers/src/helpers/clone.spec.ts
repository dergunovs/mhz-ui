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
});
