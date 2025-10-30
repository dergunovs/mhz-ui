import { ref } from 'vue';
import { describe, expect, it } from 'vitest';

import { convertParams, usePage, usePageNumber, withSetup } from '..';

const newPage = 2;
const newFilter = { _id: '123' };

describe('usePage', () => {
  it('converts params for number input', async () => {
    await withSetup(async () => {
      const page = ref(1);

      expect(convertParams(page)).toStrictEqual({ page: page.value });
    });
  });

  it('converts params for object input', async () => {
    await withSetup(async () => {
      const filter = ref({ page: newPage, sort: { value: 'title', isAsc: true }, filter: {} });
      const initiator = 'catalog';

      expect(convertParams(filter, initiator)).toStrictEqual({
        page: filter.value.page,
        dir: 'asc',
        sort: filter.value.sort.value,
        initiator,
        ...filter.value.filter,
      });

      const filterWithNoPageAndOtherDir = ref({
        page: 0,
        sort: { value: 'title', isAsc: false },
        filter: newFilter,
      });

      expect(convertParams(filterWithNoPageAndOtherDir, initiator)).toStrictEqual({
        page: 1,
        dir: 'desc',
        sort: filterWithNoPageAndOtherDir.value.sort.value,
        initiator,
        ...filterWithNoPageAndOtherDir.value.filter,
      });
    });
  });

  it('handles usePage', async () => {
    await withSetup(async () => {
      const { query, resetQuery, setQueryPage, setQueryFilter } = usePage();

      expect(query.value).toStrictEqual({ filter: {}, page: 1, sort: { isAsc: true, value: undefined } });

      setQueryPage(newPage);

      expect(query.value).toStrictEqual({ filter: {}, page: newPage, sort: { isAsc: true, value: undefined } });

      setQueryFilter(newFilter);

      expect(query.value).toStrictEqual({ filter: newFilter, page: 1, sort: { isAsc: true, value: undefined } });

      setQueryPage(newPage);

      expect(query.value).toStrictEqual({ filter: newFilter, page: newPage, sort: { isAsc: true, value: undefined } });

      const newSortValue = 'title';
      const newSortOption = { value: 'title', isAsc: false };

      resetQuery(newSortValue);

      expect(query.value).toStrictEqual({ filter: {}, page: 1, sort: { isAsc: true, value: newSortValue } });

      resetQuery(newSortOption);

      expect(query.value).toStrictEqual({ filter: {}, page: 1, sort: newSortOption });
    });
  });

  it('handles usePageNumber', async () => {
    await withSetup(async () => {
      const { page, resetPage, setPage } = usePageNumber();

      expect(page.value).toStrictEqual(1);

      setPage(newPage);
      expect(page.value).toStrictEqual(newPage);

      resetPage();

      expect(page.value).toStrictEqual(1);
    });
  });

  it('handles undefined filter in usePage', async () => {
    await withSetup(async () => {
      const { query, setQueryFilter } = usePage();

      expect(query.value).toStrictEqual({ filter: {}, page: 1, sort: { isAsc: true, value: undefined } });

      setQueryFilter();

      expect(query.value).toStrictEqual({ filter: {}, page: 1, sort: { isAsc: true, value: undefined } });
    });
  });

  it('handles empty object filter in usePage', async () => {
    await withSetup(async () => {
      const { query, setQueryFilter } = usePage({});

      expect(query.value).toStrictEqual({ filter: {}, page: 1, sort: { isAsc: true, value: undefined } });

      setQueryFilter({});

      expect(query.value).toStrictEqual({ filter: {}, page: 1, sort: { isAsc: true, value: undefined } });
    });
  });

  it('handles negative page number', async () => {
    await withSetup(async () => {
      const { query, setQueryPage } = usePage();

      setQueryPage(-1);

      expect(query.value).toStrictEqual({ filter: {}, page: 1, sort: { isAsc: true, value: undefined } });
    });
  });

  it('handles zero page number', async () => {
    await withSetup(async () => {
      const { query, setQueryPage } = usePage();

      setQueryPage(0);

      expect(query.value).toStrictEqual({ filter: {}, page: 1, sort: { isAsc: true, value: undefined } });
    });
  });
});
