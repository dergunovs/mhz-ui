<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <div :class="$style.titleBar">
        <button @click="prevMonth" :class="$style.navButton" type="button" data-test="ui-calendar-prev-month">
          {{ '<' }}
        </button>

        <span data-test="ui-calendar-current-month">{{ formattedCurrentMonth }}</span>

        <button @click="nextMonth" :class="$style.navButton" type="button" data-test="ui-calendar-next-month">
          {{ '>' }}
        </button>
      </div>

      <div :class="$style.headings">
        <div v-for="day in weekdays" :key="day" :class="$style.weekday" data-test="ui-calendar-week-day">
          {{ day }}
        </div>
      </div>
    </div>

    <div :class="$style.body">
      <div
        v-for="(date, index) in calendarDays"
        :key="index"
        :class="[$style.cell, { [$style.today]: isToday(date), [$style.outOfRange]: isOutOfRange(date) }]"
        @click="onCellClick(date)"
        data-test="ui-calendar-calendar-day"
      >
        <div :class="$style.cellDate" data-test="ui-calendar-cell-date">
          {{ date.getDate() }}
        </div>

        <div :class="$style.cellEvents">
          <div
            v-for="event in getEventsForDate(date)"
            :key="event.id"
            :class="$style.event"
            :style="{ background: event.color }"
            @click.stop="onEventClick(event)"
            data-test="ui-calendar-event"
          >
            <div :class="$style.title" data-test="ui-calendar-event-title">{{ event.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount } from 'vue';

import { TLocale } from '../locales/types';
import { ICalendarDates, ICalendarEvent } from './interface';

interface IProps {
  isDisablePastDates?: boolean;
  events?: ICalendarEvent<unknown>[];
  lang?: TLocale;
}

interface IEmit {
  update: [dates: ICalendarDates];
  eventClick: [event: ICalendarEvent<unknown>];
  chooseDate: [date: Date];
}

const props = withDefaults(defineProps<IProps>(), {
  events: () => [],
  lang: 'ru',
});

const emit = defineEmits<IEmit>();

const currentMonth = ref(new Date());

const today = computed(() => {
  const todayDate = new Date();

  todayDate.setHours(0, 0, 0, 0);

  return todayDate;
});

const currentMonthValue = computed(() => new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1));

const formattedCurrentMonth = computed(() => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
  let monthName = currentMonthValue.value.toLocaleDateString(props.lang, options);

  if (monthName.length > 0) monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  if (props.lang === 'ru') monthName = monthName.replace(/ г\.$/, '');

  return monthName;
});

const weekdays = computed(() => {
  const startOfWeek = new Date(currentMonthValue.value);

  startOfWeek.setDate(1);

  const dayOffset = (startOfWeek.getDay() + 6) % 7;

  startOfWeek.setDate(startOfWeek.getDate() - dayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);

    date.setDate(startOfWeek.getDate() + i);

    return date.toLocaleDateString(props.lang, { weekday: 'short' });
  });
});

const calendarDays = computed(() => {
  const startOfMonth = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 0);

  const startDayOffset = (startOfMonth.getDay() + 6) % 7;
  const startDate = new Date(startOfMonth);

  startDate.setDate(startOfMonth.getDate() - startDayOffset);

  const endDayOffset = (7 - endOfMonth.getDay()) % 7;
  const endDate = new Date(endOfMonth);

  endDate.setDate(endOfMonth.getDate() + endDayOffset);

  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const days: Date[] = [];

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate);

    date.setDate(startDate.getDate() + i);
    days.push(date);
  }

  return days;
});

function emitUpdate() {
  const dates = { dateFrom: calendarDays.value[0], dateTo: calendarDays.value.at(-1) as Date };

  emit('update', dates);
}

function getEventsForDate(date: Date) {
  return props.events.filter((event) => {
    if (!event.start) return false;
    const eventDate = new Date(event.start);

    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
}

function isToday(date: Date) {
  return date.toDateString() === today.value.toDateString();
}

function isOutOfRange(date: Date) {
  if (props.isDisablePastDates) {
    const dateWithoutTime = new Date(date);

    dateWithoutTime.setHours(0, 0, 0, 0);

    if (dateWithoutTime < today.value) return true;
  }

  return false;
}

function prevMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1);
  emitUpdate();
}

function nextMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1);
  emitUpdate();
}

function onEventClick(event: ICalendarEvent<unknown>) {
  emit('eventClick', event);
}

function onCellClick(date: Date) {
  if (isOutOfRange(date)) return;
  emit('chooseDate', date);
}

onBeforeMount(() => {
  emitUpdate();
});
</script>

<style module lang="scss">
.container {
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--color-gray);
  border-radius: 8px;

  .titleBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 8px;
    font-weight: 700;
    background-color: var(--color-gray-light-extra);
    border-bottom: 1px solid var(--color-gray);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    .navButton {
      padding: 0 8px;
      font-size: 1.25rem;
      cursor: pointer;
      background: none;
      border: none;
    }
  }

  .headings {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    height: 37px;
    border-bottom: 1px solid var(--color-gray);

    .weekday {
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: capitalize;
    }
  }

  .body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: minmax(72px, auto);
    gap: 0;
  }

  .cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
    align-items: center;
    justify-content: flex-start;
    min-height: 72px;
    padding: 2px;
    background-color: var(--color-white);
    box-shadow: 0 0 0 0.2px var(--color-gray) inset;

    &.today .cellDate {
      font-weight: 700;
    }

    &.outOfRange {
      cursor: not-allowed;

      .cellDate {
        color: var(--color-gray);
      }
    }
  }

  .cellDate {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cellEvents {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: flex-start;
    max-height: calc(100% - 24px);
    padding-bottom: 6px;
  }

  .event {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
    border: none;
    border-radius: 12px;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1;
    color: var(--color-gray-light);
  }
}

:global(.dark) {
  .container {
    border-color: var(--color-gray-dark-extra);

    .header {
      color: var(--color-white);
      background-color: var(--color-primary-dark);
      border-bottom-color: var(--color-gray-dark-extra);

      .titleBar {
        background-color: var(--color-primary-dark);
        border-bottom-color: var(--color-gray-dark-extra);
      }

      .navButton {
        color: var(--color-gray-dark);
      }

      .headings {
        color: var(--color-white);
        background-color: var(--color-black);
        border-right: 1px solid var(--color-gray-dark-extra);
        border-bottom: none;
        border-left: 1px solid var(--color-gray-dark-extra);
      }
    }

    .cell {
      background-color: var(--color-black);
      box-shadow: 0 0 0 0.2px var(--color-gray-dark) inset;

      .cellDate {
        color: var(--color-white);
      }

      &.outOfRange .cellDate {
        color: var(--color-gray-dark);
      }
    }
  }
}
</style>
