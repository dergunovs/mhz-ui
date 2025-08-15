import { describe, expect, test } from 'vitest';

import { localeField } from '.';

describe('localeField', () => {
  test('returns field name for ru locale', async () => {
    const fieldName = 'title';
    const locale = 'ru';

    const result = localeField(fieldName, locale);

    expect(result).toStrictEqual('title');
  });

  test('returns field name for en locale', async () => {
    const fieldName = 'title';
    const localeEn = 'en';

    const resultEn = localeField(fieldName, localeEn);

    expect(resultEn).toStrictEqual('title_en');
  });

  test('handles numeric field names', async () => {
    const fieldName = '123';
    const locale = 'en';

    const result = localeField(fieldName, locale);

    expect(result).toStrictEqual('123_en');
  });
});
