export interface ICalendarDates {
  dateFrom: Date;
  dateTo: Date;
}

export interface ICalendarEvent<T = unknown> {
  id?: string;
  start: Date | null;
  end: Date | null;
  title: string;
  content: T[];
  color?: string;
}
