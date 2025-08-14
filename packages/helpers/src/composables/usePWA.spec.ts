import { describe, expect, test } from 'vitest';

import { wait, withSetup } from '..';
import { usePWA } from '.';

describe('usePWA', () => {
  test('initializes with default values', async () => {
    withSetup(() => {
      const { isShowInstallPWA, isPWACanBeInstalled, installPWA } = usePWA();

      expect(isShowInstallPWA.value).toStrictEqual(false);
      expect(isPWACanBeInstalled.value).toStrictEqual(false);
      expect(installPWA).toBeInstanceOf(Function);
    });
  });

  test('handles install prompt event correctly', async () => {
    withSetup(async () => {
      const { isShowInstallPWA, isPWACanBeInstalled } = usePWA();

      window.dispatchEvent(new Event('beforeinstallprompt'));

      await wait(100);

      expect(isShowInstallPWA.value).toStrictEqual(true);
      expect(isPWACanBeInstalled.value).toStrictEqual(true);
    });
  });

  test('installs PWA', async () => {
    withSetup(async () => {
      const { installPWA, isShowInstallPWA } = usePWA();

      window.dispatchEvent(new Event('beforeinstallprompt'));

      await wait(50);

      expect(() => installPWA()).not.toThrow();
      expect(isShowInstallPWA.value).toStrictEqual(false);
    });
  });
});
