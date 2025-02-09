export function addZero(value: number): string {
  return value.toString().length > 1 ? `${value}` : `0${value}`;
}

export function formatDuration(duration?: number): string {
  if (!duration) return '0';

  const minutes = Math.floor(duration / 60);
  const seconds = duration - minutes * 60;

  return `${minutes ? `${minutes} мин. ` : ``}${addZero(seconds)} сек.`;
}

export function formatDate(dateRaw?: string | Date | null, lang?: 'ru' | 'en'): string {
  if (!dateRaw) return '-';

  return new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateRaw));
}

export function formatDateTime(dateRaw?: string | Date | null, lang?: 'ru' | 'en'): string {
  if (!dateRaw) return '-';

  return new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(dateRaw));
}

export function subtractDates(
  dateRaw1?: string | Date | null,
  dateRaw2?: string | Date | null,
  isRawResult?: boolean
): string | number {
  if (!dateRaw1 || !dateRaw2) return '-';

  const date1 = new Date(dateRaw1);
  const date2 = new Date(dateRaw2);

  const duration = Math.floor(((date1 as unknown as number) - (date2 as unknown as number)) / 1000);

  return isRawResult ? duration : formatDuration(duration);
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

export function getFirstAndLastWeekDays(weeksCount: number): IWeekDays[] {
  const days: IWeekDays[] = [];

  for (let i = 0; i < weeksCount; i++) {
    const today = new Date();

    const firstDay = new Date(
      today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) - i * 7)
    );

    const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 7));

    firstDay.setHours(0, 0, 0, 0);
    lastDay.setHours(23, 59, 59);

    days.push({
      dateFrom: firstDay,
      dateTo: lastDay,
      label: `${firstDay.toLocaleDateString('ru').slice(0, -5)} - ${lastDay.toLocaleDateString('ru').slice(0, -5)}`,
    });
  }

  return days.reverse();
}
