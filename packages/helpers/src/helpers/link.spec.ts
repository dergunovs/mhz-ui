import { describe, expect, test } from 'vitest';

import { isLinkActive } from './index.js';

describe('link', () => {
  test('checks is link active', async () => {
    const mainUrl = '/';
    const catalogUrl = '/product';
    const productUrl = '/product/123';

    expect(isLinkActive(mainUrl, mainUrl)).toBe(true);
    expect(isLinkActive(catalogUrl, catalogUrl)).toBe(true);
    expect(isLinkActive(productUrl, productUrl)).toBe(true);
    expect(isLinkActive(productUrl, catalogUrl)).toBe(true);
    expect(isLinkActive(productUrl, mainUrl)).toBe(false);
    expect(isLinkActive(catalogUrl, productUrl)).toBe(false);
  });
});
