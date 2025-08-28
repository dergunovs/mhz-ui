type TLocale = 'ru' | 'en';
type TDate = string | Date | null;

export function addZero(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

export function formatDuration(duration?: number, lang?: TLocale): string {
  if (!duration || duration < 0) return '0';

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  const min = lang === 'ru' ? 'мин' : 'min';
  const sec = lang === 'ru' ? 'сек' : 'sec';

  const minutesFormatted = minutes ? `${minutes} ${min}. ` : ``;

  return `${minutesFormatted}${addZero(seconds)} ${sec}.`;
}

export function formatDate(dateRaw?: TDate, lang?: TLocale): string {
  if (!dateRaw || Number.isNaN(new Date(dateRaw).getTime())) return '0';

  return (
    new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-EN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateRaw)) || '0'
  );
}

export function formatDateTime(dateRaw?: TDate, lang?: TLocale): string {
  if (!dateRaw || Number.isNaN(new Date(dateRaw).getTime())) return '0';

  return new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-EN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(dateRaw));
}

export function subtractDates(
  dateFuture?: TDate,
  datePast?: TDate,
  lang?: TLocale,
  isRawResult?: boolean
): string | number {
  if (!dateFuture || !datePast) return '0';

  const date1 = new Date(dateFuture);
  const date2 = new Date(datePast);

  if (Number.isNaN(date1.getTime()) || Number.isNaN(date2.getTime())) return '0';

  const duration = Math.floor((date1.getTime() - date2.getTime()) / 1000);

  return isRawResult ? duration : formatDuration(duration, lang);
}

export interface IDatesGap {
  dateFrom: Date;
  dateTo: Date;
  dateFromPrev: Date;
  dateToPrev: Date;
}

export function getDatesByDayGap(gap: number): IDatesGap {
  const day = 86400000;

  const dateTo = new Date();
  const dateFrom = new Date(dateTo.getTime() - gap * day);

  const dateToPrev = new Date(dateFrom.getTime() - 1);
  const dateFromPrev = new Date(dateToPrev.getTime() - gap * day);

  return { dateFrom, dateTo, dateFromPrev, dateToPrev };
}

export interface IWeekDays {
  dateFrom: Date;
  dateTo: Date;
  label: string;
}

export function getFirstAndLastDays(count: number, isMonth: boolean): IWeekDays[] {
  const dates: IWeekDays[] = [];

  for (let i = 0; i < count; i++) {
    const today = new Date();
    const currentDay = today.getDay() === 0 ? -6 : 1;
    const firstDay = new Date(today.setDate(isMonth ? 1 : today.getDate() - today.getDay() + currentDay - i * 7));

    if (isMonth) firstDay.setMonth(today.getMonth() - i);

    const lastDay = isMonth
      ? new Date(today.getFullYear(), today.getMonth() + 1 - i, 0)
      : new Date(today.setDate(today.getDate() - today.getDay() + 7));

    firstDay.setHours(0, 0, 0, 0);
    lastDay.setHours(23, 59, 59);

    dates.push({
      dateFrom: firstDay,
      dateTo: lastDay,
      label: `${firstDay.toLocaleDateString('ru').slice(0, -5)} - ${lastDay.toLocaleDateString('ru').slice(0, -5)}`,
    });
  }

  return dates.reverse();
}

export function getOneYearFromNow() {
  const date = new Date();

  date.setFullYear(date.getFullYear() + 1);

  return date.toUTCString();
}
