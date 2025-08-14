import { DefineComponent, nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiCalendar from './UiCalendar.vue';

import { EVENTS } from './constants';
import { ICalendarEvent } from './interface';
import { wrapperFactory } from '@/test';

const calendar = dataTest('ui-calendar');

let wrapper: VueWrapper<InstanceType<typeof UiCalendar>>;

beforeEach(() => {
  wrapper = wrapperFactory(UiCalendar, {
    events: EVENTS,
  });
});

enableAutoUnmount(afterEach);

describe('UiCalendar', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UiCalendar)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets events to calendar', async () => {
    expect(
      wrapper.findComponent<DefineComponent<{ events: ICalendarEvent<unknown>[] }>>(calendar).vm.$props.events
    ).toStrictEqual(EVENTS);
  });

  it('emits calendar events', async () => {
    const date = new Date();
    const date2 = new Date();

    const formattedDates = { dateFrom: date, dateTo: date2 };

    const readyEvent = { view: { firstCellDate: date, lastCellDate: date2 } };
    const updateEvent = { extendedStart: date, extendedEnd: date2 };
    const clickEvent = { event: EVENTS[0] };
    const cellEvent = { cell: { start: date } };

    wrapper.findComponent<DefineComponent>(calendar).vm.$emit('ready', readyEvent);
    wrapper.findComponent<DefineComponent>(calendar).vm.$emit('viewChange', updateEvent);
    wrapper.findComponent<DefineComponent>(calendar).vm.$emit('event:click', clickEvent);
    wrapper.findComponent<DefineComponent>(calendar).vm.$emit('cell:click', cellEvent);

    await nextTick();

    expect(wrapper.emitted('ready')).toHaveLength(1);
    expect(wrapper.emitted()['ready'][0]).toEqual([formattedDates]);

    expect(wrapper.emitted('update')).toHaveLength(1);
    expect(wrapper.emitted()['update'][0]).toEqual([formattedDates]);

    expect(wrapper.emitted('eventClick')).toHaveLength(1);
    expect(wrapper.emitted()['eventClick'][0]).toEqual([EVENTS[0]]);

    expect(wrapper.emitted('chooseDate')).toHaveLength(1);
    expect(wrapper.emitted()['chooseDate'][0]).toEqual([date]);
  });

  it('emits ready event with correct date format', async () => {
    const date = new Date();
    const date2 = new Date();

    const readyEvent = { view: { firstCellDate: date, lastCellDate: date2 } };

    wrapper.findComponent<DefineComponent>(calendar).vm.$emit('ready', readyEvent);

    await nextTick();

    expect(wrapper.emitted('ready')).toHaveLength(1);
    expect(wrapper.emitted()['ready'][0]).toEqual([{ dateFrom: date, dateTo: date2 }]);
  });

  it('emits update event with correct date format', async () => {
    const date = new Date();
    const date2 = new Date();

    const updateEvent = { extendedStart: date, extendedEnd: date2 };

    wrapper.findComponent<DefineComponent>(calendar).vm.$emit('viewChange', updateEvent);

    await nextTick();

    expect(wrapper.emitted('update')).toHaveLength(1);
    expect(wrapper.emitted()['update'][0]).toEqual([{ dateFrom: date, dateTo: date2 }]);
  });

  it('emits eventClick with correct event data', async () => {
    const clickEvent = { event: EVENTS[0] };

    wrapper.findComponent<DefineComponent>(calendar).vm.$emit('event:click', clickEvent);

    await nextTick();

    expect(wrapper.emitted('eventClick')).toHaveLength(1);
    expect(wrapper.emitted()['eventClick'][0]).toEqual([EVENTS[0]]);
  });

  it('emits chooseDate with correct date', async () => {
    const date = new Date();
    const cellEvent = { cell: { start: date } };

    wrapper.findComponent<DefineComponent>(calendar).vm.$emit('cell:click', cellEvent);

    await nextTick();

    expect(wrapper.emitted('chooseDate')).toHaveLength(1);
    expect(wrapper.emitted()['chooseDate'][0]).toEqual([date]);
  });
});
