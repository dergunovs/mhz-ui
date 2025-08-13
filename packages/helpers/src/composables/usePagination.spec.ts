import { describe, expect, test } from 'vitest';
import { ref } from 'vue';

import { withSetup } from '..';
import { usePagination } from '.';

describe('usePagination', () => {
  test('initializes with undefined data and total', async () => {
    withSetup(() => {
      const dataRaw = ref<{ data: string[]; total: number } | undefined>(undefined);
      const { data, total, setPaginationPage } = usePagination(dataRaw);

      expect(data.value).toBeUndefined();
      expect(total.value).toBeUndefined();
      expect(setPaginationPage(1, 1)).toStrictEqual(1);
    });
  });

  test('sets pagination page correctly', async () => {
    withSetup(() => {
      const dataRaw = ref<{ data: string[]; total: number } | undefined>({
        data: ['item1', 'item2'],
        total: 5,
      });
      const { setPaginationPage } = usePagination(dataRaw);

      expect(setPaginationPage(1, 1)).toStrictEqual(1);
      expect(setPaginationPage(3, 1)).toStrictEqual(3);
      expect(setPaginationPage(0, 1)).toStrictEqual(1);
      expect(setPaginationPage(6, 1)).toStrictEqual(1);
    });
  });

  test('handles data and total correctly', async () => {
    withSetup(() => {
      const dataRaw = ref<{ data: string[]; total: number } | undefined>({
        data: ['item1', 'item2'],
        total: 5,
      });
      const { data, total } = usePagination(dataRaw);

      expect(data.value).toStrictEqual(['item1', 'item2']);
      expect(total.value).toStrictEqual(5);
    });
  });
});
