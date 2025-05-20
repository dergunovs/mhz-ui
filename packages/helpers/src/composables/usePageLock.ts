import { ref, onMounted, onBeforeUnmount } from 'vue';

export function usePageLock() {
  const pageLock = ref<WakeLockSentinel>();

  async function lockPage() {
    pageLock.value = await navigator.wakeLock?.request();
  }

  function releasePage() {
    pageLock.value?.release();
    pageLock.value = undefined;
  }

  async function updatePageVisibility() {
    if (document.visibilityState === 'visible') {
      await lockPage();
    } else {
      releasePage();
    }
  }

  onMounted(async () => {
    await lockPage();
    document.addEventListener('visibilitychange', updatePageVisibility);
  });

  onBeforeUnmount(() => {
    releasePage();

    document.removeEventListener('visibilitychange', updatePageVisibility);
  });
}
