import { computed, Ref } from 'vue';

export function usePagination<T>(dataRaw: Ref<{ data: T[]; total: number } | undefined>) {
  const data = computed(() => dataRaw.value?.data);
  const total = computed(() => dataRaw.value?.total);

  function setPaginationPage(pageToSet: number, page: number): number {
    if (!total.value) return page;

    if (pageToSet < 1 || pageToSet > total.value) return page;

    return pageToSet;
  }

  return { data, total, setPaginationPage };
}
