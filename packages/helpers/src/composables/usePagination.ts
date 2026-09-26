import { computed, Ref } from 'vue';

export function usePagination<T>(dataRaw: Ref<{ data: T[]; total: number } | undefined>) {
  const data = computed(() => dataRaw.value?.data || []);
  const total = computed(() => dataRaw.value?.total || 0);

  function setPaginationPage(pageToSet: number): number {
    return !total.value || pageToSet < 1 || pageToSet > total.value ? 1 : pageToSet;
  }

  return { data, total, setPaginationPage };
}
