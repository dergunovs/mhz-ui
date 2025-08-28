import { describe, expect, test, vi } from 'vitest';

import { scrollToTop } from '.';

const mockScrollTo = vi.fn();
const mockQuerySelector = vi.fn();

describe('scrollToTop', () => {
  const setupMocks = () => {
    vi.clearAllMocks();
    mockQuerySelector.mockReturnValue({ scrollTo: mockScrollTo });
    globalThis.document.querySelector = mockQuerySelector;
  };

  test('scrolls to top of element', async () => {
    setupMocks();
    const element = '#test-element';

    scrollToTop(element);

    expect(mockQuerySelector).toHaveBeenCalledWith(element);
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  test('handles case when element is not found', async () => {
    setupMocks();
    const element = '#non-existent-element';

    mockQuerySelector.mockReturnValue(null);

    expect(() => scrollToTop(element)).not.toThrow();

    expect(mockQuerySelector).toHaveBeenCalledWith(element);
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  test('scrolls to top with different element selector', async () => {
    setupMocks();
    const element = '.container';

    scrollToTop(element);

    expect(mockQuerySelector).toHaveBeenCalledWith(element);
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  test('handles empty string selector', async () => {
    setupMocks();
    const element = '';

    scrollToTop(element);

    expect(mockQuerySelector).toHaveBeenCalledWith(element);
    expect(mockScrollTo).not.toHaveBeenCalledTimes(0);
  });

  test('handles null selector', async () => {
    setupMocks();
    const element = null as unknown as string;

    scrollToTop(element);

    expect(mockQuerySelector).toHaveBeenCalledWith(element);
    expect(mockScrollTo).not.toHaveBeenCalledTimes(0);
  });

  test('handles invalid selector', async () => {
    setupMocks();
    const element = 'invalid-selector[';

    scrollToTop(element);

    expect(mockQuerySelector).toHaveBeenCalledWith(element);
    expect(mockScrollTo).not.toHaveBeenCalledTimes(0);
  });
});
