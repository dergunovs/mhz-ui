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

      await wait(100);

      expect(() => usePageLock()).not.toThrow();
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  test('handles visibility change to visible', async () => {
    vi.stubGlobal('navigator', mockNavigator);

    const mockRelease = vi.fn();

    mockRequest.mockResolvedValue({ release: mockRelease });

    withSetup(async () => {
      usePageLock();

      await wait(100);

      document.dispatchEvent(new Event('visibilitychange'));
      document.dispatchEvent(new Event('visibilitychange'));

      expect(mockRequest).toHaveBeenCalledTimes(2);
    });
  });
});
