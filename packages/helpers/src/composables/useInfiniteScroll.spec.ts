import { describe, expect, test } from 'vitest';

import { withSetup } from '../index.js';
import { useInfiniteScroll } from './index.js';

interface IData {
  id: number;
  title: string;
}

const data: IData[] = [
  { id: 1, title: 'Первый' },
  { id: 2, title: 'Второй' },
];

describe('useInfiniteScroll', () => {
  test('handles scroll', async () => {
    withSetup(() => {
      const { page, allData, addData, handleScroll } = useInfiniteScroll<IData>();

      expect(page.value).toStrictEqual(1);
      expect(allData.value).toStrictEqual([]);

      addData(data);

      expect(allData.value).toStrictEqual(data);

      addData(data);

      expect(allData.value).toStrictEqual([...data, ...data]);

      const secondPageNumber = 2;

      handleScroll(false, secondPageNumber);

      expect(page.value).toStrictEqual(secondPageNumber);
    });
  });
});
