import { describe, expect, it } from 'vitest';

import { withSetup } from '..';
import { usePwa } from '.';

describe('usePwa', () => {
  it('initializes with default values', async () => {
    await withSetup(async () => {
      const { isShowInstallPWA, isPWACanBeInstalled, installPWA } = usePwa();

      expect(isShowInstallPWA.value).toStrictEqual(false);
      expect(isPWACanBeInstalled.value).toStrictEqual(false);
      expect(installPWA).toBeInstanceOf(Function);
      expect(() => installPWA()).not.toThrow();
    });
  });
});
