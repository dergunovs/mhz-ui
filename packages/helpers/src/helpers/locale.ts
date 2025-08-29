import { TLocale } from '@/locales/types';

export function localeField<T>(name: string, locale: TLocale) {
  const prefix = locale === 'ru' ? '' : `_${locale}`;

  return `${name}${prefix}` as keyof T;
}
