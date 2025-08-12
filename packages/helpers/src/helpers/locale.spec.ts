import { describe, expect, test } from 'vitest';

import { localeField } from '.';

describe('localeField', () => {
  test('returns field name for ru locale', async () => {
    const fieldName = 'title';
    const locale = 'ru';
    const localeEn = 'en';

    const result = localeField(fieldName, locale);
    const resultEn = localeField(fieldName, localeEn);

    expect(result).toStrictEqual('title');
    expect(resultEn).toStrictEqual('title_en');
  });
});
