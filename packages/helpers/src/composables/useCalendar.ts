import { ref } from 'vue';

export interface ICalendarDates {
  dateFrom: Date;
  dateTo: Date;
}

export function useCalendar() {
  const dateFrom = ref<Date>();
  const dateTo = ref<Date>();

  const isDatesReady = ref(false);

  function updateDates(dates: ICalendarDates) {
    dateFrom.value = dates.dateFrom;
    dateTo.value = dates.dateTo;

    isDatesReady.value = true;
  }

  return { dateFrom, dateTo, isDatesReady, updateDates };
}
