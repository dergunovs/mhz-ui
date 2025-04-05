import { describe, expect, test } from 'vitest';

import { createTempId, deleteTempId } from './index.js';

describe('id', () => {
  test('creates temp id', async () => {
    expect(createTempId()).toContain('temp-');
  });

  test('deletes temp id', async () => {
    const objectWithTempId = {
      _id: 'temp-f0e5ba29-1a71-4126-aa9e-86f4e720',
      title: 'title',
    };

    const objectWithoutTempId = deleteTempId([objectWithTempId]);

    expect(objectWithoutTempId[0]).toStrictEqual({ title: 'title' });
  });

  test('deletes all id', async () => {
    const objectWithId = {
      _id: 'f0e5ba29-1a71-4126-aa9e-86f4e720',
      title: 'title',
    };

    const objectWithoutTempId = deleteTempId([objectWithId]);

    expect(objectWithoutTempId[0]).toStrictEqual(objectWithId);

    const objectWithoutAnyId = deleteTempId([objectWithId], true);

    expect(objectWithoutAnyId[0]).toStrictEqual({ title: 'title' });
  });
});
