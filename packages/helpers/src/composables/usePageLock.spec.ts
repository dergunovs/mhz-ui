import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { withSetup } from '..';
import { usePageLock } from '.';

const mockRequest = vi.fn();
const mockRelease = vi.fn();

describe('usePageLock', () => {
  beforeEach(() => {
    mockRequest.mockClear();
    mockRelease.mockClear();
    mockRequest.mockResolvedValue({ release: mockRelease });

    vi.stubGlobal('navigator', {
      wakeLock: { request: mockRequest },
    } as unknown as Navigator & typeof globalThis);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('initializes and locks page on mount', async () => {
    await withSetup(async () => {
      usePageLock();

      await nextTick();

      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  it('releases lock on unmount', async () => {
    await withSetup(async () => {
      usePageLock();

      await nextTick();

      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    expect(mockRelease).toHaveBeenCalledTimes(0);
  });

  it('handles visibility change to visible', async () => {
    await withSetup(async () => {
      usePageLock();

      await nextTick();

      mockRequest.mockClear();

      Object.defineProperty(document, 'visibilityState', { writable: true, value: 'visible' });
      document.dispatchEvent(new Event('visibilitychange'));

      expect(mockRequest).toHaveBeenCalledTimes(2);
    });
  });

  it('handles visibility change to hidden', async () => {
    await withSetup(async () => {
      usePageLock();

      await nextTick();

      Object.defineProperty(document, 'visibilityState', { writable: true, value: 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));

      expect(mockRelease).toHaveBeenCalledTimes(3);
    });
  });

  it('handles multiple visibility changes', async () => {
    await withSetup(async () => {
      usePageLock();

      await nextTick();

      mockRequest.mockClear();
      mockRelease.mockClear();

      Object.defineProperty(document, 'visibilityState', { writable: true, value: 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));

      Object.defineProperty(document, 'visibilityState', { writable: true, value: 'visible' });
      document.dispatchEvent(new Event('visibilitychange'));

      expect(mockRelease).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledTimes(4);
    });
  });

  it('handles wake lock API not available', async () => {
    vi.stubGlobal('navigator', {} as Navigator);

    await withSetup(async () => {
      expect(() => usePageLock()).not.toThrow();
      expect(mockRequest).not.toHaveBeenCalled();
    });
  });

  it('handles release when no active lock', async () => {
    await withSetup(async () => {
      usePageLock();

      await nextTick();

      expect(() => {
        Object.defineProperty(document, 'visibilityState', { writable: true, value: 'hidden' });
        document.dispatchEvent(new Event('visibilitychange'));
      }).not.toThrow();
    });
  });
});
