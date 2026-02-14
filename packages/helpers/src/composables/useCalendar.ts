import { shallowRef } from 'vue';

export interface ICalendarDates {
  dateFrom: Date;
  dateTo: Date;
}

export function useCalendar() {
  const dateFrom = shallowRef<Date>();
  const dateTo = shallowRef<Date>();

  const isDatesReady = shallowRef(false);

  function updateDates(dates: ICalendarDates) {
    dateFrom.value = dates.dateFrom;
    dateTo.value = dates.dateTo;

    isDatesReady.value = true;
  }

  return { dateFrom, dateTo, isDatesReady, updateDates };
}
