import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiCalendar from './UiCalendar.vue';

import { EVENTS as ORIGINAL_EVENTS, LANG } from './constants';
import { ICalendarEvent } from './interface';
import { wrapperFactory } from '@/test';

const prevMonth = dataTest('ui-calendar-prev-month');
const currentMonth = dataTest('ui-calendar-current-month');
const nextMonth = dataTest('ui-calendar-next-month');
const weekDay = dataTest('ui-calendar-week-day');
const calendarDay = dataTest('ui-calendar-calendar-day');
const cellDate = dataTest('ui-calendar-cell-date');
const event = dataTest('ui-calendar-event');
const eventTitle = dataTest('ui-calendar-event-title');

let wrapper: VueWrapper<InstanceType<typeof UiCalendar>>;

const FIXED_DATE = new Date('2023-10-15T12:00:00Z');

const EVENTS: ICalendarEvent<object>[] = ORIGINAL_EVENTS.map((eventToUpdate) => ({
  ...eventToUpdate,
  start: new Date('2023-10-16T00:00:00Z'),
  end: new Date('2023-10-16T00:00:00Z'),
}));

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_DATE);

  wrapper = wrapperFactory(UiCalendar, {
    events: EVENTS,
    lang: LANG,
  });
});

enableAutoUnmount(afterEach);

afterEach(() => {
  vi.useRealTimers();
});

describe('UiCalendar', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UiCalendar)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows current month in title', async () => {
    const currentMonthElement = wrapper.find(currentMonth);

    expect(currentMonthElement.exists()).toBe(true);

    const expectedMonth = FIXED_DATE.toLocaleDateString(LANG, { month: 'long', year: 'numeric' });
    const capitalizedMonth = expectedMonth.charAt(0).toUpperCase() + expectedMonth.slice(1);

    expect(currentMonthElement.text()).toBe(capitalizedMonth.replace(/ г\.$/, ''));
  });

  it('shows weekdays in header', async () => {
    const weekdayElements = wrapper.findAll(weekDay);

    expect(weekdayElements.length).toBe(7);

    weekdayElements.forEach((element) => {
      expect(element.exists()).toBe(true);
      expect(element.text().length).toBeGreaterThan(0);
    });
  });

  it('shows calendar days', async () => {
    const dayElements = wrapper.findAll(calendarDay);

    expect(dayElements.length).toBeGreaterThan(28);

    dayElements.forEach((element) => {
      expect(element.exists()).toBe(true);
      const cellDateElement = element.find(cellDate);

      expect(cellDateElement.exists()).toBe(true);
    });
  });

  it('navigates to previous month on prev button click', async () => {
    const prevButton = wrapper.find(prevMonth);

    expect(prevButton.exists()).toBe(true);

    const initialMonthText = wrapper.find(currentMonth).text();

    await prevButton.trigger('click');

    const newMonthText = wrapper.find(currentMonth).text();

    expect(newMonthText).not.toBe(initialMonthText);
  });

  it('navigates to next month on next button click', async () => {
    const nextButton = wrapper.find(nextMonth);

    expect(nextButton.exists()).toBe(true);

    const initialMonthText = wrapper.find(currentMonth).text();

    await nextButton.trigger('click');

    const newMonthText = wrapper.find(currentMonth).text();

    expect(newMonthText).not.toBe(initialMonthText);
  });

  it('shows events for dates', async () => {
    expect(wrapper.findAll(event).length).toStrictEqual(EVENTS.length);
  });

  it('emits eventClick when event is clicked', async () => {
    const eventElement = wrapper.find(event);

    expect(eventElement.exists()).toBe(true);

    await eventElement.trigger('click');

    const emittedEvents = wrapper.emitted('eventClick');

    expect(emittedEvents).toHaveLength(1);
    expect(emittedEvents?.[0]).toHaveLength(1);
  });

  it('emits chooseDate when date cell is clicked', async () => {
    const dayElement = wrapper.find(calendarDay);

    expect(dayElement.exists()).toBe(true);

    await dayElement.trigger('click');

    const emittedDates = wrapper.emitted('chooseDate');

    expect(emittedDates).toHaveLength(1);
    expect(emittedDates?.[0]).toHaveLength(1);
    expect(emittedDates?.[0]?.[0]).toBeInstanceOf(Date);
  });

  it('does not emit chooseDate when out of range date is clicked', async () => {
    await wrapper.setProps({ isDisablePastDates: true });

    const outOfRangeElements = wrapper.findAll('[data-test="ui-calendar-calendar-day"]');
    const outOfRangeElement = outOfRangeElements.find((element) => {
      return element.classes().includes('outOfRange');
    });

    if (outOfRangeElement) {
      await outOfRangeElement.trigger('click');

      const emittedDates = wrapper.emitted('chooseDate');

      expect(emittedDates).toBeUndefined();
    }
  });

  it('emits update when month changes', async () => {
    const emittedUpdates = wrapper.emitted('update');

    expect(emittedUpdates).toHaveLength(1);

    const prevButton = wrapper.find(prevMonth);

    await prevButton.trigger('click');

    expect(emittedUpdates).toHaveLength(2);
    expect(emittedUpdates?.[1]).toHaveLength(1);

    const updateData = emittedUpdates?.[1]?.[0];

    if (updateData && typeof updateData === 'object') {
      expect(updateData).toHaveProperty('dateFrom');
      expect(updateData).toHaveProperty('dateTo');
      expect((updateData as { dateFrom: Date; dateTo: Date }).dateFrom).toBeInstanceOf(Date);
      expect((updateData as { dateFrom: Date; dateTo: Date }).dateTo).toBeInstanceOf(Date);
    }
  });

  it('shows event titles', async () => {
    const eventElements = wrapper.findAll(event);

    eventElements.forEach((element) => {
      const titleElement = element.find(eventTitle);

      expect(titleElement.exists()).toBe(true);
      expect(titleElement.text().length).toBeGreaterThan(0);
    });
  });

  it('handles empty events array', async () => {
    await wrapper.setProps({ events: [] });

    const eventElements = wrapper.findAll(event);

    expect(eventElements.length).toBe(0);
  });
});
