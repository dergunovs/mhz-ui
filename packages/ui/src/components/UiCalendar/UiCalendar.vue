<template>
  <div :class="$style.container">
    <VueCal
      eventsOnMonthView
      view="month"
      :views="['month']"
      :viewsBar="false"
      :time="false"
      :events="props.events"
      :minDate="props.minDate"
      :locale="props.lang === 'en' ? 'en-gb' : props.lang"
      :todayButton="false"
      @ready="
        (dates: ICalendarReady) =>
          emit('ready', { dateFrom: dates?.view?.firstCellDate, dateTo: dates?.view?.lastCellDate })
      "
      @viewChange="
        (dates: ICalendarUpdate) => emit('update', { dateFrom: dates?.extendedStart, dateTo: dates?.extendedEnd })
      "
      @event:click="(event: ICalendarEventClick) => emit('eventClick', event?.event)"
      @cell:click="(event: ICalendarCellClick) => emit('chooseDate', event?.cell?.start)"
      data-test="ui-calendar"
    >
      <template #event="{ event }">
        <div :class="$style.title" :style="`background: ${event.color}`">
          {{ event.title }}
        </div>
      </template>
    </VueCal>
  </div>
</template>

<script setup lang="ts">
import { VueCal } from 'vue-cal';
// eslint-disable-next-line import-x/no-unassigned-import
import 'vue-cal/style';

import {
  ICalendarEvent,
  ICalendarDates,
  ICalendarReady,
  ICalendarUpdate,
  ICalendarEventClick,
  ICalendarCellClick,
} from './interface';

import { TLocale } from '@/components/locales/types';

interface IProps {
  minDate?: Date;
  events?: ICalendarEvent<unknown>[];
  lang?: TLocale;
}

interface IEmit {
  ready: [dates: ICalendarDates];
  update: [dates: ICalendarDates];
  eventClick: [event: ICalendarEvent<unknown>];
  chooseDate: [date: Date];
}

const props = withDefaults(defineProps<IProps>(), {
  minDate: undefined,
  events: () => [],
  lang: 'ru',
});

const emit = defineEmits<IEmit>();
</script>

<style module lang="scss">
.container {
  width: 100%;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-gray-light);
  }

  :global(.vuecal) {
    --vuecal-primary-color: var(--color-gray-light);
    --vuecal-secondary-color: var(--color-white);
    --vuecal-base-color: var(--color-black);
    --vuecal-contrast-color: var(--color-black);
    --vuecal-border-color: var(--color-gray);
    --vuecal-header-color: var(--color-black);
    --vuecal-event-color: var(--color-white);
    --vuecal-border-radius: 8px;
    --vuecal-height: auto;
    --vuecal-transition-duration: 0;
  }

  :global(.vuecal-event-delete-leave-active) {
    transition: 0ms;
  }

  :global(.vuecal-event-delete-leave-to) {
    transform: none;
  }

  :global(.vuecal__header) {
    border: 1px solid var(--color-gray);
  }

  :global(.vuecal__title-bar) {
    padding-top: 7px;
    padding-bottom: 6px;
    background-color: var(--color-gray-light-extra);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  :global(.vuecal__headings) {
    height: 36px;
    padding-top: 4px;
    border-bottom: 1px solid var(--color-gray-light);
  }

  :global(.vuecal--default-theme .vuecal__weekday) {
    font-size: 1rem;
    letter-spacing: 0;
  }

  :global(.vuecal__body) {
    grid-template-rows: auto;
  }

  :global(.vuecal--default-theme .vuecal__scrollable--month-view .vuecal__cell) {
    align-items: center;
    min-height: 72px;
  }

  :global(.vuecal--default-theme:is(.vuecal--sm, .vuecal--lg) .vuecal__scrollable--month-view .vuecal__cell-date) {
    aspect-ratio: 6/5;
    padding: 2px 0 0;
    margin: 0;
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 0;
  }

  :global(
    .vuecal--default-theme.vuecal--light:is(.vuecal--sm, .vuecal--lg)
      .vuecal__scrollable--month-view
      .vuecal__cell--today
      .vuecal__cell-date
  ),
  :global(
    .vuecal--default-theme.vuecal--light:is(.vuecal--sm, .vuecal--lg)
      .vuecal__scrollable--month-view
      .vuecal__cell--selected
      .vuecal__cell-date
  ) {
    font-weight: 700;
    background-color: unset;
  }

  :global(.vuecal--default-theme .vuecal__cell) {
    box-shadow: 0 0 0 0.2px var(--color-gray) inset;
  }

  :global(.vuecal--default-theme.vuecal--timeless .vuecal__cell-events) {
    align-items: center;
    justify-content: center;
    padding-top: 0;
    padding-bottom: 7px;
  }

  :global(.vuecal__scrollable--month-view .vuecal__event) {
    width: 36px;
    height: 36px;
    padding-top: 0;
    padding-bottom: 0;
    cursor: pointer;
    border: none;
  }

  :global(.vuecal__scrollable--month-view .vuecal__event),
  :global(.vuecal--default-theme .vuecal__event-details) {
    padding: 0;
    border-radius: 12px;
  }

  :global(.vuecal--default-theme .vuecal__cell--disabled .vuecal__cell-date),
  :global(.vuecal__cell--out-of-range) {
    color: var(--color-gray-dark);
    opacity: 1;
  }

  :global(.vuecal--default-theme .vuecal__weekday-day) {
    opacity: 1;
  }
}
</style>
