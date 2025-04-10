export function localeField<T>(name: string, locale: string) {
  const prefix = locale === 'ru' ? '' : `_${locale}`;

  return `${name}${prefix}` as keyof T;
}
