import { describe, expect, test } from 'vitest';

import { withSetup } from '..';
import { useInfiniteScroll } from '.';

interface IData {
  id: number;
  title: string;
}

const data: IData[] = [
  { id: 1, title: 'Первый' },
  { id: 2, title: 'Второй' },
];

describe('useInfiniteScroll', () => {
  test('initializes with page 1 and empty allData', async () => {
    withSetup(() => {
      const { page, allData } = useInfiniteScroll<IData>();

      expect(page.value).toStrictEqual(1);
      expect(allData.value).toStrictEqual([]);
    });
  });

  test('adds data', async () => {
    withSetup(() => {
      const { allData, addData } = useInfiniteScroll<IData>();

      expect(allData.value).toStrictEqual([]);

      addData(data);

      expect(allData.value).toStrictEqual(data);

      addData(data);

      expect(allData.value).toStrictEqual([...data, ...data]);
    });
  });

  test('handles scroll', async () => {
    withSetup(() => {
      const { page, handleScroll } = useInfiniteScroll<IData>();

      expect(page.value).toStrictEqual(1);

      const secondPageNumber = 2;

      handleScroll(false, secondPageNumber);

      expect(page.value).toStrictEqual(secondPageNumber);
    });
  });

  test('does not change page when loading', async () => {
    withSetup(() => {
      const { page, handleScroll } = useInfiniteScroll<IData>();

      expect(page.value).toStrictEqual(1);

      const secondPageNumber = 2;

      handleScroll(true, secondPageNumber);

      expect(page.value).toStrictEqual(1);
    });
  });
});
