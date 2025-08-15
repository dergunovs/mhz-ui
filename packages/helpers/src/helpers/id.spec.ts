import { describe, expect, test } from 'vitest';

import { createTempId, deleteTempId } from '.';

describe('id', () => {
  test('creates temp id with different format', async () => {
    const id = createTempId();

    expect(id).toMatch(/^temp-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
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

  test('deletes temp id with non-temp id', async () => {
    const objectWithNormalId = {
      _id: 'f0e5ba29-1a71-4126-aa9e-86f4e720',
      title: 'title',
    };

    const result = deleteTempId([objectWithNormalId]);

    expect(result[0]).toStrictEqual(objectWithNormalId);
  });

  test('handles empty array', async () => {
    const result = deleteTempId([]);

    expect(result).toStrictEqual([]);
  });

  test('handles mixed objects with and without _id', async () => {
    const objects = [{ _id: 'temp-123', title: 'title1' }, { title: 'title2' }, { _id: '456', title: 'title3' }];

    const result = deleteTempId(objects);

    expect(result).toStrictEqual([{ title: 'title1' }, { title: 'title2' }, { _id: '456', title: 'title3' }]);
  });

  test('handles empty string _id', async () => {
    const objectWithEmptyId = { _id: '', title: 'title' };

    const result = deleteTempId([objectWithEmptyId]);

    expect(result[0]).toStrictEqual(objectWithEmptyId);
  });
});
