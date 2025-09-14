import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { withSetup } from '..';
import { usePageLock } from '.';

const mockRequest = vi.fn().mockResolvedValue({ release: vi.fn() });

describe('usePageLock', () => {
  beforeEach(() => {
    mockRequest.mockClear();
    vi.stubGlobal('navigator', { wakeLock: { request: mockRequest } } as unknown as Navigator & typeof globalThis);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('locks page correctly', async () => {
    await withSetup(async () => {
      usePageLock();

      await nextTick();

      expect(() => usePageLock()).not.toThrow();
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  it('handles visibility change to visible', async () => {
    const mockRelease = vi.fn();

    mockRequest.mockResolvedValue({ release: mockRelease });

    await withSetup(async () => {
      usePageLock();

      await nextTick();

      mockRequest.mockClear();

      document.dispatchEvent(new Event('visibilitychange'));
      document.dispatchEvent(new Event('visibilitychange'));

      expect(mockRequest).toHaveBeenCalledTimes(2);
    });
  });
});
