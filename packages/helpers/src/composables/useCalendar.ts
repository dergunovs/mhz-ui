import { ref } from 'vue';

export interface ICalendarDates {
  dateFrom: string;
  dateTo: string;
}

export function useActivityCalendar() {
  const dateFrom = ref('');
  const dateTo = ref('');

  const isDatesReady = ref(false);

  function updateDates(dates: ICalendarDates) {
    isDatesReady.value = true;

    dateFrom.value = dates.dateFrom;
    dateTo.value = dates.dateTo;
  }

  return { dateFrom, dateTo, isDatesReady, updateDates };
}
