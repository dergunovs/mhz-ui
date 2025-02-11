import { DefineComponent, nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiCalendar from './UiCalendar.vue';

import { EVENTS } from './constants';
import { ICalendarEvent } from './interface';
import { wrapperFactory } from '@/test';

const event = { firstCellDate: '01-01-2025', lastCellDate: '01-02-2025' };

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
    wrapper.findComponent<DefineComponent>(calendar).vm.$emit('ready', event);
    wrapper.findComponent<DefineComponent>(calendar).vm.$emit('viewChange', event);
    wrapper.findComponent<DefineComponent>(calendar).vm.$emit('eventClick', event);

    await nextTick();

    expect(wrapper.emitted('ready')).toHaveLength(1);
    expect(wrapper.emitted()['ready'][0]).toEqual([event]);

    expect(wrapper.emitted('update')).toHaveLength(1);
    expect(wrapper.emitted()['update'][0]).toEqual([event]);

    expect(wrapper.emitted('eventClick')).toHaveLength(1);
    expect(wrapper.emitted()['eventClick'][0]).toEqual([event]);
  });
});
