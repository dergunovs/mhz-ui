import { describe, expect, test, vi } from 'vitest';

import { wait, withSetup } from '..';
import { usePageLock } from '.';

const mockRequest = vi.fn().mockResolvedValue({ release: vi.fn() });
const mockNavigator = { wakeLock: { request: mockRequest } } as unknown as Navigator & typeof globalThis;

describe('usePageLock', () => {
  test('locks page correctly', async () => {
    vi.stubGlobal('navigator', mockNavigator);

    withSetup(async () => {
      usePageLock();

      await wait(50);

      expect(() => usePageLock()).not.toThrow();
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });
});
