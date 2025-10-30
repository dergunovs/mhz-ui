import { describe, expect, it } from 'vitest';

import { useInfiniteScroll, withSetup } from '..';

interface IData {
  id: number;
  title: string;
}

const data: IData[] = [
  { id: 1, title: 'Первый' },
  { id: 2, title: 'Второй' },
];

describe('useInfiniteScroll', () => {
  it('initializes with page 1 and empty allData', async () => {
    await withSetup(async () => {
      const { page, allData } = useInfiniteScroll<IData>();

      expect(page.value).toStrictEqual(1);
      expect(allData.value).toStrictEqual([]);
    });
  });

  it('adds data', async () => {
    await withSetup(async () => {
      const { allData, addData } = useInfiniteScroll<IData>();

      expect(allData.value).toStrictEqual([]);

      addData(data);

      expect(allData.value).toStrictEqual(data);

      addData(data);

      expect(allData.value).toStrictEqual([...data, ...data]);
    });
  });

  it('handles scroll', async () => {
    await withSetup(async () => {
      const { page, handleScroll } = useInfiniteScroll<IData>();

      expect(page.value).toStrictEqual(1);

      const secondPageNumber = 2;

      handleScroll(false, secondPageNumber);

      expect(page.value).toStrictEqual(secondPageNumber);
    });
  });

  it('does not change page when loading', async () => {
    await withSetup(async () => {
      const { page, handleScroll } = useInfiniteScroll<IData>();

      expect(page.value).toStrictEqual(1);

      const secondPageNumber = 2;

      handleScroll(true, secondPageNumber);

      expect(page.value).toStrictEqual(1);
    });
  });

  it('handles empty data array', async () => {
    await withSetup(async () => {
      const { allData, addData } = useInfiniteScroll<IData>();

      expect(allData.value).toStrictEqual([]);

      addData([]);

      expect(allData.value).toStrictEqual([]);
    });
  });

  it('handles negative page number', async () => {
    await withSetup(async () => {
      const { page, handleScroll } = useInfiniteScroll<IData>();

      expect(page.value).toStrictEqual(1);

      handleScroll(false, -1);

      expect(page.value).toStrictEqual(1);
    });
  });

  it('handles zero page number', async () => {
    await withSetup(async () => {
      const { page, handleScroll } = useInfiniteScroll<IData>();

      expect(page.value).toStrictEqual(1);

      handleScroll(false, 0);

      expect(page.value).toStrictEqual(1);
    });
  });
});
