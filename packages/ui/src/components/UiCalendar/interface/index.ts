export interface ICalendarEvent<T> {
  id?: string;
  start: Date | null;
  end: Date | null;
  title: string;
  content: T[];
  color?: string;
}

export interface ICalendarReady {
  view: {
    firstCellDate: string;
    lastCellDate: string;
  };
}

export interface ICalendarUpdate {
  extendedStart: string;
  extendedEnd: string;
}

export interface ICalendarDates {
  dateFrom: string;
  dateTo: string;
}

export interface ICalendarEventClick {
  event: ICalendarEvent<unknown>;
}

export interface ICalendarCellClick {
  cell: { start: Date };
}

export type TLocale = 'ru' | 'en';
