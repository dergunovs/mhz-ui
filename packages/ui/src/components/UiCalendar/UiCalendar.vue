<template>
  <div :class="$style.container">
    <VueCal
      hideViewSelector
      eventsOnMonthView="short"
      activeView="month"
      :disableViews="['years', 'year', 'day', 'week']"
      :time="false"
      :transitions="false"
      :events="props.events"
      :minDate="props.minDate"
      :locale="props.lang"
      @ready="(event: ICalendarUpdate) => emit('ready', event)"
      @viewChange="(event: ICalendarUpdate) => emit('update', event)"
      @eventClick="(event: ICalendarEvent<unknown>) => emit('eventClick', event)"
      @cellClick="(date: Date) => emit('chooseDate', date)"
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
import { computed } from 'vue';

import VueCal from 'vue-cal';

import 'vue-cal/dist/vuecal.css';
import { ICalendarEvent, ICalendarUpdate } from './interface';

interface IProps {
  height?: string;
  minDate?: Date;
  events?: ICalendarEvent<unknown>[];
  lang?: string;
}

const props = defineProps<IProps>();
const emit = defineEmits<{
  ready: [dates: ICalendarUpdate];
  update: [dates: ICalendarUpdate];
  eventClick: [event: ICalendarEvent<unknown>];
  chooseDate: [date: Date];
}>();

const heightComputed = computed(() => (props.height ? `${props.height}px` : '500px'));
</script>

<style module lang="scss">
.container {
  width: 100%;
  height: v-bind(heightComputed);
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1.125rem;
  color: var(--color-gray-light);
}

:global(.vuecal) {
  border-radius: 8px;
}

:global(.vuecal__body) {
  border-radius: 8px;
}

:global(.vuecal__cell-events) {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

:global(.vuecal__event) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
  border-radius: 12px;
}

:global(.vuecal__event--focus) {
  box-shadow: none;
}

:global(.vuecal__title-bar) {
  min-height: 41px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-black);
  background-color: var(--color-gray-light-extra);
  border: 1px solid var(--color-gray);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

:global(.vuecal__arrow) {
  color: var(--color-black);
}

:global(.vuecal__title span:nth-child(2)) {
  display: none;
}

:global(.vuecal__cell--out-of-scope) {
  color: var(--color-gray-dark);
}

:global(.vuecal__cell--selected),
:global(.vuecal__cell--today) {
  background-color: var(--color-gray-light-extra);
}
</style>
