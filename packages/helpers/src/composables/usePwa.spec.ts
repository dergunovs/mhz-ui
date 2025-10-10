import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { withSetup } from '..';
import { usePwa } from '.';

describe('usePwa', () => {
  const mockPrompt = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(globalThis, 'addEventListener');
    vi.spyOn(globalThis, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with default values', async () => {
    await withSetup(async () => {
      const { isShowInstallPWA, isPWACanBeInstalled, installPWA } = usePwa();

      expect(isShowInstallPWA.value).toStrictEqual(false);
      expect(isPWACanBeInstalled.value).toStrictEqual(false);
      expect(installPWA).toBeInstanceOf(Function);
    });
  });

  it('handles installPWA when no prompt available', async () => {
    await withSetup(async () => {
      const { installPWA } = usePwa();

      expect(() => installPWA()).not.toThrow();
      expect(mockPrompt).not.toHaveBeenCalled();
    });
  });

  it('handles non-prompt events correctly', async () => {
    await withSetup(async () => {
      const { isShowInstallPWA, isPWACanBeInstalled } = usePwa();

      globalThis.dispatchEvent(new Event('beforeinstallprompt'));

      await nextTick();

      expect(isPWACanBeInstalled.value).toBe(false);
      expect(isShowInstallPWA.value).toBe(false);
    });
  });

  it('sets up event listeners correctly', async () => {
    await withSetup(async () => {
      usePwa();
    });

    expect(globalThis.addEventListener).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function));
  });
});
