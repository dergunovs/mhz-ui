import { ref, watch, Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export interface ISortOption {
  value?: string;
  isAsc: boolean;
}

export interface IPageQuery {
  page: number;
  sort: ISortOption;
  filter: object;
}

export interface IPageParams {
  page: number;
}

export interface IPageSortParams extends IPageParams {
  dir: string;
  sort?: string;
  initiator?: string;
}

export function convertParams(params: Ref<IPageQuery | number>, initiator?: string): IPageSortParams | IPageParams {
  if (typeof params.value === 'number') {
    return { page: params.value };
  }

  const { page, sort, filter } = params.value;

  return {
    page: page || 1,
    dir: sort.isAsc === false ? 'desc' : 'asc',
    sort: sort.value,
    initiator,
    ...filter,
  };
}

export function usePage(filter?: object) {
  const router = useRouter();
  const route = useRoute();

  const query: Ref<IPageQuery> = ref({
    page: Number(route.query.page || 1),
    sort: { value: route.query.sort?.toString(), isAsc: route.query.dir !== 'desc' },
    filter: { ...filter },
  });

  function resetQuery(sortValue: string | ISortOption) {
    if (typeof sortValue === 'string') {
      query.value = {
        page: 1,
        sort: { value: sortValue, isAsc: true },
        filter: {},
      };
    } else {
      query.value = {
        ...query.value,
        page: 1,
        sort: sortValue,
      };
    }
  }

  function setQueryPage(pageToSet: number) {
    query.value.page = pageToSet;
  }

  function setQueryFilter(filterToSet?: object) {
    query.value = {
      page: 1,
      sort: query.value.sort,
      filter: { ...filterToSet },
    };
  }

  watch(
    () => [query.value.page, query.value.sort.value, query.value.sort.isAsc],
    () => {
      router.push({
        path: route.path,
        query: {
          page: query.value.page,
          sort: query.value.sort.value,
          dir: query.value.sort.isAsc ? 'asc' : 'desc',
        },
      });
    }
  );

  return { query, resetQuery, setQueryPage, setQueryFilter };
}

export function usePageNumber() {
  const router = useRouter();
  const route = useRoute();

  const page = ref(Number(route.query.page || 1));

  function resetPage() {
    page.value = 1;
  }

  function setPage(pageToSet: number) {
    page.value = pageToSet;
  }

  watch(
    () => page.value,
    () => {
      router.push({ path: route.path, query: { page: page.value } });
    }
  );

  return { page, resetPage, setPage };
}
