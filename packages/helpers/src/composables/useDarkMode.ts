import { shallowRef, onBeforeMount, readonly } from 'vue';

export function useDarkMode() {
  const isDarkModeState = shallowRef(false);
  const isDarkMode = readonly(isDarkModeState);

  onBeforeMount(() => {
    const isLocalStorageValue = localStorage.getItem('dark');

    if (isLocalStorageValue === null) {
      localStorage.setItem('dark', 'false');
    } else {
      const isDarkModeEnabled = isLocalStorageValue === 'true';

      isDarkModeState.value = isDarkModeEnabled;
      if (isDarkModeEnabled) document.body?.classList.add('dark');
    }
  });

  function toggleDarkMode() {
    isDarkModeState.value = !isDarkModeState.value;
    document.body?.classList.toggle('dark', isDarkModeState.value);
    localStorage.setItem('dark', String(isDarkModeState.value));
  }

  return { isDarkMode, toggleDarkMode };
}
