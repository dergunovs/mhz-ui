import { describe, expect, test } from 'vitest';

import { withSetup } from '..';
import { usePWA } from '.';

describe('usePWA', () => {
  test('initializes with default values', async () => {
    await withSetup(async () => {
      const { isShowInstallPWA, isPWACanBeInstalled, installPWA } = usePWA();

      expect(isShowInstallPWA.value).toStrictEqual(false);
      expect(isPWACanBeInstalled.value).toStrictEqual(false);
      expect(installPWA).toBeInstanceOf(Function);
      expect(() => installPWA()).not.toThrow();
    });
  });
});
