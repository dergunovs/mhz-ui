import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { usePageLock, withSetup } from '..';

const mockRequest = vi.fn();
const mockRelease = vi.fn();

function flushPromises() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

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
    const { app } = await withSetup(async () => {
      usePageLock();

      await flushPromises();

      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    app.unmount();
  });

  it('releases lock on unmount', async () => {
    const { app } = await withSetup(async () => {
      usePageLock();

      await flushPromises();

      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    expect(mockRelease).toHaveBeenCalledTimes(0);

    app.unmount();

    expect(mockRelease).toHaveBeenCalledTimes(1);
  });

  it('handles visibility change to visible', async () => {
    const { app } = await withSetup(async () => {
      usePageLock();

      await flushPromises();

      mockRequest.mockClear();

      Object.defineProperty(document, 'visibilityState', { writable: true, value: 'visible' });
      document.dispatchEvent(new Event('visibilitychange'));

      await flushPromises();

      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    app.unmount();
  });

  it('handles visibility change to hidden', async () => {
    const { app } = await withSetup(async () => {
      usePageLock();

      await flushPromises();

      Object.defineProperty(document, 'visibilityState', { writable: true, value: 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));

      expect(mockRelease).toHaveBeenCalledTimes(1);
    });

    app.unmount();
  });

  it('handles multiple visibility changes', async () => {
    const { app } = await withSetup(async () => {
      usePageLock();

      await flushPromises();

      mockRequest.mockClear();
      mockRelease.mockClear();

      Object.defineProperty(document, 'visibilityState', { writable: true, value: 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));

      Object.defineProperty(document, 'visibilityState', { writable: true, value: 'visible' });
      document.dispatchEvent(new Event('visibilitychange'));

      await flushPromises();

      expect(mockRelease).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    app.unmount();
  });

  it('handles wake lock API not available', async () => {
    vi.stubGlobal('navigator', {} as Navigator);

    const { app } = await withSetup(async () => {
      expect(() => usePageLock()).not.toThrow();
      expect(mockRequest).not.toHaveBeenCalled();
    });

    app.unmount();
  });

  it('handles release when no active lock', async () => {
    const { app } = await withSetup(async () => {
      usePageLock();

      await nextTick();

      expect(() => {
        Object.defineProperty(document, 'visibilityState', { writable: true, value: 'hidden' });
        document.dispatchEvent(new Event('visibilitychange'));
      }).not.toThrow();
    });

    app.unmount();
  });
});
