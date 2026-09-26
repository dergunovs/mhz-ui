import { nextTick } from 'vue';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { useDarkMode, withSetup } from '..';

describe('useDarkMode', () => {
  beforeAll(() => {
    const store: { [key: string]: string } = {};

    const mockStorage = {
      getItem(key: string) {
        return store[key] || null;
      },
      setItem(key: string, value: string) {
        store[key] = value;
      },
      clear() {
        for (const key of Object.keys(store)) {
          delete store[key];
        }
      },
    };

    Object.defineProperty(globalThis, 'localStorage', { value: mockStorage, writable: true });
  });

  beforeEach(() => {
    localStorage.clear();
    if (document.body) document.body.className = '';
  });

  it('should initialize with false when no localStorage value', async () => {
    await withSetup(async () => {
      const { isDarkMode } = useDarkMode();

      await nextTick();

      expect(isDarkMode.value).toBe(false);
      expect(localStorage.getItem('dark')).toBe('false');
    });
  });

  it('should initialize with true when localStorage has true', async () => {
    localStorage.setItem('dark', 'true');

    await withSetup(async () => {
      const { isDarkMode } = useDarkMode();

      await nextTick();

      expect(isDarkMode.value).toBe(true);
      expect(document.body?.classList.contains('dark')).toBe(true);
    });
  });

  it('should initialize with false when localStorage has false', async () => {
    localStorage.setItem('dark', 'false');

    await withSetup(async () => {
      const { isDarkMode } = useDarkMode();

      await nextTick();

      expect(isDarkMode.value).toBe(false);
      expect(document.body?.classList.contains('dark')).toBe(false);
    });
  });

  it('should toggle dark mode correctly', async () => {
    await withSetup(async () => {
      const { isDarkMode, toggleDarkMode } = useDarkMode();

      await nextTick();

      expect(isDarkMode.value).toBe(false);
      expect(document.body?.classList.contains('dark')).toBe(false);

      toggleDarkMode();
      expect(isDarkMode.value).toBe(true);
      expect(localStorage.getItem('dark')).toBe('true');
      expect(document.body?.classList.contains('dark')).toBe(true);

      toggleDarkMode();
      expect(isDarkMode.value).toBe(false);
      expect(localStorage.getItem('dark')).toBe('false');
      expect(document.body?.classList.contains('dark')).toBe(false);
    });
  });

  it('should handle string "false" correctly', async () => {
    localStorage.setItem('dark', 'false');

    await withSetup(async () => {
      const { isDarkMode } = useDarkMode();

      await nextTick();

      expect(isDarkMode.value).toBe(false);
      expect(document.body?.classList.contains('dark')).toBe(false);
    });
  });
});
