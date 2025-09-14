import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { withSetup } from '..';
import { usePagination } from '.';

describe('usePagination', () => {
  it('initializes with undefined data and total', async () => {
    await withSetup(async () => {
      const dataRaw = ref<{ data: string[]; total: number } | undefined>(undefined);
      const { data, total, setPaginationPage } = usePagination(dataRaw);

      expect(data.value).toStrictEqual([]);
      expect(total.value).toBe(0);
      expect(setPaginationPage(1, 1)).toStrictEqual(1);
    });
  });

  it('sets pagination page correctly', async () => {
    await withSetup(async () => {
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

  it('handles data and total correctly', async () => {
    await withSetup(async () => {
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
