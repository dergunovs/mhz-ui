<template>
  <div ref="inputBlockRef" :class="$style.inputBlock" data-test="ui-date">
    <input
      :value="displayValue"
      type="text"
      inputmode="numeric"
      :disabled="props.isDisabled"
      :class="$style.input"
      :placeholder="placeholderText"
      maxlength="10"
      :lang="props.lang"
      data-test="ui-date-input"
      v-bind="$attrs"
      @input="parseInput"
      @blur="applyInput"
    />

    <svg
      :class="$style.icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      data-test="ui-date-icon"
      @click="toggleCalendar"
    >
      <path
        d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14
           c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2
           zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2
           zm4 0h-2v-2h2v2z"
      />
    </svg>

    <div v-if="isShowCalendar" :class="$style.calendar" data-test="ui-date-calendar">
      <UiFlex column gap="12">
        <div :class="$style.calendarHeader">
          <button type="button" :class="$style.calendarButton" data-test="ui-date-prev" @click="prevMonth">&lt;</button>

          <div :class="$style.calendarSelects">
            <select
              :class="$style.calendarSelect"
              :value="calendarDate.getMonth()"
              data-test="ui-date-month"
              @change="updateMonth"
            >
              <option v-for="(monthName, index) in MESSAGES[props.lang].months" :key="monthName" :value="index">
                {{ monthName }}
              </option>
            </select>

            <select
              :class="$style.calendarSelect"
              :value="calendarDate.getFullYear()"
              data-test="ui-date-year"
              @change="updateYear"
            >
              <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <button type="button" :class="$style.calendarButton" data-test="ui-date-next" @click="nextMonth">&gt;</button>
        </div>

        <div :class="$style.calendarGrid">
          <div
            v-for="dayName in MESSAGES[props.lang].daysShort"
            :key="dayName"
            :class="$style.dayName"
            data-test="ui-date-day-name"
          >
            {{ dayName }}
          </div>

          <div
            v-for="day in calendarGrid"
            :key="day.date.toISOString()"
            :class="[$style.day, !day.isCurrentMonth && $style.dayOther, day.isSelected && $style.daySelected]"
            :data-current-month="day.isCurrentMonth"
            :data-selected="day.isSelected"
            data-test="ui-date-day"
            @click="selectDate(day.date)"
          >
            {{ day.date.getDate() }}
          </div>
        </div>
      </UiFlex>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import UiFlex from '../UiFlex/UiFlex.vue';

import { TLocale } from '@/components/locales/types';
import { MESSAGES } from '@/components/locales';

interface IProps {
  modelValue?: string | null;
  isDisabled?: boolean;
  placeholder?: string;
  lang?: TLocale;
}

interface IEmit {
  'update:modelValue': [value: string];
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  placeholder: '',
  lang: 'ru',
});

const emit = defineEmits<IEmit>();

defineOptions({ inheritAttrs: false });

const inputBlockRef = ref<HTMLElement | null>(null);
const inputValue = ref<string>('');
const isShowCalendar = ref(false);
const calendarDate = ref<Date>(new Date());

const DATE_REGEX: { [key in TLocale]: RegExp } = {
  ru: /^(\d{2})\.(\d{2})\.(\d{4})$/,
  en: /^(\d{2})\/(\d{2})\/(\d{4})$/,
};

const now = new Date();
const currentYear = now.getFullYear();
const yearOptions = Array.from({ length: 101 }, (_, index) => currentYear - 50 + index);

const placeholderText = computed(() => props.placeholder || MESSAGES[props.lang].datePlaceholder);

const displayValue = computed(() => {
  return inputValue.value || formatDisplayValue(props.modelValue);
});

const selectedDateISO = computed(() => {
  if (!props.modelValue) return '';

  return /^\d{4}-\d{2}-\d{2}$/.test(props.modelValue) ? props.modelValue : '';
});

const calendarGrid = computed(() => {
  const year = calendarDate.value.getFullYear();
  const month = calendarDate.value.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const days: { date: Date; isCurrentMonth: boolean; isSelected: boolean }[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(year, month, 1 - startOffset + index);

    days.push({
      date,
      isCurrentMonth: date.getMonth() === month,
      isSelected: dateToISO(date) === selectedDateISO.value,
    });
  }

  return days;
});

watch(
  () => props.modelValue,
  (value) => {
    setCalendarDate(value);
  },
  { immediate: true }
);

onMounted(() => {
  document.addEventListener('click', closeOnDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnDocumentClick);
});

function parseInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;

  inputValue.value = value;

  const parsed = parseDate(value, props.lang);

  if (parsed !== undefined) {
    emit('update:modelValue', parsed);
  }
}

function applyInput() {
  const parsed = parseDate(inputValue.value, props.lang);

  if (parsed !== undefined) {
    emit('update:modelValue', parsed);
  }

  inputValue.value = '';
}

function toggleCalendar() {
  if (props.isDisabled) return;

  isShowCalendar.value = !isShowCalendar.value;
}

function updateMonth(event: Event) {
  const month = Number((event.target as HTMLSelectElement).value);

  calendarDate.value = new Date(calendarDate.value.getFullYear(), month, 1);
}

function updateYear(event: Event) {
  const year = Number((event.target as HTMLSelectElement).value);

  calendarDate.value = new Date(year, calendarDate.value.getMonth(), 1);
}

function prevMonth() {
  calendarDate.value = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth() - 1, 1);
}

function nextMonth() {
  calendarDate.value = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth() + 1, 1);
}

function selectDate(date: Date) {
  const value = dateToISO(date);

  emit('update:modelValue', value);
  inputValue.value = '';
  isShowCalendar.value = false;
}

function closeOnDocumentClick(event: MouseEvent) {
  if (inputBlockRef.value?.contains(event.target as Node)) return;

  isShowCalendar.value = false;
}

function setCalendarDate(value?: string | null) {
  if (!value) {
    calendarDate.value = new Date();

    return;
  }

  const [year, month, day] = value.split('-').map(Number);

  if (year && month && day) {
    calendarDate.value = new Date(year, month - 1, day);
  }
}

function formatDisplayValue(value?: string | null): string {
  return value ? formatDate(value, props.lang) : '';
}

function formatDate(value: string, locale: TLocale): string {
  const [year, month, day] = value.split('-', 3);

  if (!year || !month || !day) return value;

  return locale === 'en' ? `${month}/${day}/${year}` : `${day}.${month}.${year}`;
}

function parseDate(value: string, locale: TLocale): string | undefined {
  const match = DATE_REGEX[locale].exec(value);

  if (!match) return undefined;

  const [, part1, part2, yearString] = match;

  const isEn = locale === 'en';
  const day = Number(isEn ? part2 : part1);
  const month = Number(isEn ? part1 : part2);
  const year = Number(yearString);

  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    : undefined;
}

function dateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
</script>

<style module lang="scss">
.inputBlock {
  position: relative;
  display: flex;
  width: 100%;
  border-radius: 16px;
}

.input {
  width: 100%;
  height: 40px;
  padding: 0 44px 0 16px;
  font-size: 1rem;
  outline: none;
  background-color: var(--color-transparent);
  border: 1px solid var(--color-gray);
  border-radius: 16px;

  &:hover {
    border-color: var(--color-gray-dark-extra);
  }

  &:focus {
    border-color: var(--color-primary);
  }

  &:disabled {
    color: var(--color-gray-dark-extra);
    background-color: var(--color-gray-light-extra);
    border-color: var(--color-transparent);
  }

  &::placeholder {
    color: var(--color-gray-dark-extra);
  }
}

.icon {
  position: absolute;
  top: 50%;
  right: 12px;
  width: 20px;
  height: 20px;
  color: var(--color-gray-dark-extra);
  cursor: pointer;
  fill: currentcolor;
  transform: translateY(-50%);
}

.inputBlock:has(.input:focus) .icon {
  color: var(--color-primary);
}

.calendar {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 10;
  width: 100%;
  min-width: 280px;
  padding: 16px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray);
  border-radius: 16px;
}

.calendarHeader {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.calendarSelects {
  display: flex;
  gap: 8px;
}

.calendarSelect {
  height: 32px;
  padding: 0 8px;
  font-size: 0.875rem;
  background-color: var(--color-transparent);
  border: 1px solid var(--color-gray);
  border-radius: 8px;
}

.calendarButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 1.25rem;
  color: var(--color-gray-dark);
  cursor: pointer;
  background-color: var(--color-transparent);
  border: 1px solid var(--color-gray);
  border-radius: 8px;

  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
}

.calendarGrid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.dayName {
  padding: 4px 0;
  font-size: 0.875rem;
  color: var(--color-gray-dark-extra);
  text-align: center;
}

.day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 8px;

  &:hover:not(.daySelected) {
    background-color: var(--color-gray-light-extra);
  }
}

.dayOther {
  color: var(--color-gray-dark-extra);
}

.daySelected {
  color: var(--color-white);
  background-color: var(--color-primary);
}

:global(.dark) {
  .input {
    background-color: var(--color-gray-dark);
    border-color: var(--color-gray-dark-extra);
  }

  .calendar {
    background-color: var(--color-gray-dark);
    border-color: var(--color-gray-dark-extra);
  }
}

:global(dialog) {
  overflow: visible;
}
</style>
