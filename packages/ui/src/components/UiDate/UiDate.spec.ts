import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, wait } from 'mhz-helpers';

import UiDate from './UiDate.vue';

import {
  DATE_DISPLAY_EN,
  DATE_DISPLAY_RU,
  DATE_VALUE,
  DEFAULT_LANG,
  DEFAULT_MODEL_VALUE,
  DEFAULT_PLACEHOLDER,
  IS_DISABLED,
  MONTH_JANUARY_INDEX,
  YEAR,
} from './constants';

import { MESSAGES } from '@/components/locales';

import { wrapperFactory } from '@/test';

const dateInput = dataTest('ui-date-input');
const dateIcon = dataTest('ui-date-icon');
const dateCalendar = dataTest('ui-date-calendar');
const datePrev = dataTest('ui-date-prev');
const dateNext = dataTest('ui-date-next');
const dateMonth = dataTest('ui-date-month');
const dateYear = dataTest('ui-date-year');
const dateDayName = dataTest('ui-date-day-name');
const dateDay = dataTest('ui-date-day');

enableAutoUnmount(afterEach);

describe('UiDate', async () => {
  let wrapper: VueWrapper<InstanceType<typeof UiDate>>;

  beforeEach(() => {
    wrapper = wrapperFactory(UiDate, {
      modelValue: DEFAULT_MODEL_VALUE,
      placeholder: DEFAULT_PLACEHOLDER,
      isDisabled: IS_DISABLED,
      lang: DEFAULT_LANG,
    });
  });

  it('exists', async () => {
    expect(wrapper.findComponent(UiDate)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows input value formatted by lang', async () => {
    await wrapper.setProps({ modelValue: DATE_VALUE, lang: 'ru' });

    expect((wrapper.find(dateInput).element as HTMLInputElement).value).toBe(DATE_DISPLAY_RU);

    await wrapper.setProps({ lang: 'en' });

    expect((wrapper.find(dateInput).element as HTMLInputElement).value).toBe(DATE_DISPLAY_EN);
  });

  it('shows placeholder by lang', async () => {
    expect(wrapper.find(dateInput).attributes('placeholder')).toBe(MESSAGES.ru.datePlaceholder);

    await wrapper.setProps({ lang: 'en' });

    expect(wrapper.find(dateInput).attributes('placeholder')).toBe(MESSAGES.en.datePlaceholder);
  });

  it('shows custom placeholder', async () => {
    const placeholder = 'Custom placeholder';

    await wrapper.setProps({ placeholder });

    expect(wrapper.find(dateInput).attributes('placeholder')).toBe(placeholder);
  });

  it('disables input by props', async () => {
    expect(wrapper.find(dateInput).attributes('disabled')).toBeUndefined();

    await wrapper.setProps({ isDisabled: true });

    expect(wrapper.find(dateInput).attributes('disabled')).toBe('');
  });

  it('toggles calendar by icon click', async () => {
    expect(wrapper.find(dateCalendar).exists()).toBe(false);

    await wrapper.find(dateIcon).trigger('click');

    expect(wrapper.find(dateCalendar).exists()).toBe(true);

    await wrapper.find(dateIcon).trigger('click');

    expect(wrapper.find(dateCalendar).exists()).toBe(false);
  });

  it('does not toggle calendar when disabled', async () => {
    await wrapper.setProps({ isDisabled: true });
    await wrapper.find(dateIcon).trigger('click');

    expect(wrapper.find(dateCalendar).exists()).toBe(false);
  });

  it('shows localized day names', async () => {
    await wrapper.find(dateIcon).trigger('click');

    const dayNames = wrapper.findAll(dateDayName);

    expect(dayNames).toHaveLength(7);
    expect(dayNames[0].text()).toBe(MESSAGES.ru.daysShort[0]);

    await wrapper.setProps({ lang: 'en' });

    const dayNamesEn = wrapper.findAll(dateDayName);

    expect(dayNamesEn[0].text()).toBe(MESSAGES.en.daysShort[0]);
  });

  it('shows localized month names in select', async () => {
    await wrapper.setProps({ modelValue: DATE_VALUE });
    await wrapper.find(dateIcon).trigger('click');

    const options = wrapper.find(dateMonth).findAll('option');

    expect(options[MONTH_JANUARY_INDEX].text()).toBe(MESSAGES.ru.months[MONTH_JANUARY_INDEX]);
  });

  it('selects date and emits value', async () => {
    await wrapper.setProps({ modelValue: DATE_VALUE });
    await wrapper.find(dateIcon).trigger('click');

    const selectedDay = wrapper.findAll(dateDay).find((day) => day.attributes('data-selected') === 'true');

    expect(selectedDay).toBeTruthy();

    await selectedDay?.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([DATE_VALUE]);
    expect(wrapper.find(dateCalendar).exists()).toBe(false);
  });

  it('changes month by prev and next buttons', async () => {
    await wrapper.setProps({ modelValue: DATE_VALUE });
    await wrapper.find(dateIcon).trigger('click');

    expect(Number((wrapper.find(dateMonth).element as HTMLSelectElement).value)).toBe(MONTH_JANUARY_INDEX);
    expect(Number((wrapper.find(dateYear).element as HTMLSelectElement).value)).toBe(YEAR);

    await wrapper.find(dateNext).trigger('click');

    expect(Number((wrapper.find(dateMonth).element as HTMLSelectElement).value)).toBe(MONTH_JANUARY_INDEX + 1);

    await wrapper.find(datePrev).trigger('click');

    expect(Number((wrapper.find(dateMonth).element as HTMLSelectElement).value)).toBe(MONTH_JANUARY_INDEX);
  });

  it('changes month and year by selects', async () => {
    await wrapper.setProps({ modelValue: DATE_VALUE });
    await wrapper.find(dateIcon).trigger('click');

    await wrapper.find(dateMonth).setValue('5');

    expect(Number((wrapper.find(dateMonth).element as HTMLSelectElement).value)).toBe(5);

    await wrapper.find(dateYear).setValue(String(YEAR + 1));

    expect(Number((wrapper.find(dateYear).element as HTMLSelectElement).value)).toBe(YEAR + 1);
  });

  it('emits update:modelValue on valid input', async () => {
    await wrapper.find(dateInput).setValue(DATE_DISPLAY_RU);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([DATE_VALUE]);
  });

  it('does not emit update:modelValue on invalid input', async () => {
    await wrapper.find(dateInput).setValue('invalid');

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('formats input value on blur', async () => {
    await wrapper.setProps({ modelValue: DATE_VALUE });
    await wrapper.find(dateInput).setValue('invalid');
    await wrapper.find(dateInput).trigger('blur');

    expect((wrapper.find(dateInput).element as HTMLInputElement).value).toBe(DATE_DISPLAY_RU);
  });

  it('closes calendar on outside click', async () => {
    await wrapper.find(dateIcon).trigger('click');

    expect(wrapper.find(dateCalendar).exists()).toBe(true);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await wait();

    expect(wrapper.find(dateCalendar).exists()).toBe(false);
  });
});
