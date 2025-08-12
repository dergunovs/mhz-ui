import { describe, expect, test } from 'vitest';

import { isLinkActive } from '.';

describe('link', () => {
  test('checks is link active - exact match', async () => {
    const mainUrl = '/';
    const catalogUrl = '/product';
    const productUrl = '/product/123';

    expect(isLinkActive(mainUrl, mainUrl)).toBe(true);
    expect(isLinkActive(catalogUrl, catalogUrl)).toBe(true);
    expect(isLinkActive(productUrl, productUrl)).toBe(true);
  });

  test('checks is link active - nested path', async () => {
    const productUrl = '/product/123';
    const catalogUrl = '/product';

    expect(isLinkActive(productUrl, catalogUrl)).toBe(true);
  });

  test('checks is link active - different paths', async () => {
    const productUrl = '/product/123';
    const mainUrl = '/';

    expect(isLinkActive(productUrl, mainUrl)).toBe(false);
  });

  test('checks is link active - reverse case', async () => {
    const catalogUrl = '/product';
    const productUrl = '/product/123';

    expect(isLinkActive(catalogUrl, productUrl)).toBe(false);
  });

  test('checks is link active - root path edge case', async () => {
    const mainUrl = '/';
    const otherUrl = '/other';

    expect(isLinkActive(mainUrl, otherUrl)).toBe(false);
  });
});
