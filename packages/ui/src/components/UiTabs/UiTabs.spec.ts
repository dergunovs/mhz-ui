import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiTabs from './UiTabs.vue';
import { TABS } from './constants';

import { wrapperFactory } from '@/test';

const tabs = dataTest('ui-tabs');
const tab = dataTest('ui-tab');

let wrapper: VueWrapper<InstanceType<typeof UiTabs>>;

beforeEach(() => {
  wrapper = wrapperFactory(UiTabs, { tabs: TABS, modelValue: TABS[0].value });
});

enableAutoUnmount(afterEach);

describe('UiTabs', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UiTabs)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders tabs correctly', async () => {
    expect(wrapper.findAll(tab).length).toBe(TABS.length);

    expect(wrapper.find(tab).text()).toBe(TABS[0].title);
    expect(wrapper.find(tab).attributes('data-active')).toBe('true');
  });

  it('updates modelValue when tab is clicked', async () => {
    const secondTab = wrapper.findAll(tab)[1];

    await secondTab.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([TABS[1].value]);
  });

  it('sets active tab correctly', async () => {
    await wrapper.setProps({ modelValue: TABS[1].value });

    const tabElements = wrapper.findAll(tab);

    expect(tabElements[0].attributes('data-active')).toBe('false');
    expect(tabElements[1].attributes('data-active')).toBe('true');
    expect(tabElements[2].attributes('data-active')).toBe('false');
  });

  it('handles empty tabs array', async () => {
    await wrapper.setProps({ tabs: [] });

    expect(wrapper.findAll(tab).length).toBe(0);
    expect(wrapper.find(tabs).exists()).toBe(true);
  });
});
