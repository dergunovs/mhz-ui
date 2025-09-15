import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiChip from './UiChip.vue';

import { DEFAULT_TYPE, DEFAULT_SLOT } from './constants';

import { wrapperFactory } from '@/test';

const chip = dataTest('ui-chip');
const chipEdit = dataTest('ui-chip-edit');
const chipDelete = dataTest('ui-chip-delete');

let wrapper: VueWrapper<InstanceType<typeof UiChip>>;

beforeEach(() => {
  wrapper = wrapperFactory(UiChip, { type: DEFAULT_TYPE }, { default: DEFAULT_SLOT });
});

enableAutoUnmount(afterEach);

describe('UiChip', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UiChip)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows text by slot', async () => {
    expect(wrapper.find(chip).text()).toBe(DEFAULT_SLOT);
  });

  it('sets type by props', async () => {
    expect(wrapper.find(chip).attributes('data-type')).toBe(DEFAULT_TYPE);
  });

  it('shows edit button and emits event by click', async () => {
    expect(wrapper.find(chipEdit).exists()).toBe(false);

    await wrapper.setProps({ isEdit: true });

    expect(wrapper.find(chipEdit).exists()).toBe(true);

    await wrapper.find(chipEdit).trigger('click');

    expect(wrapper.emitted('edit')).toHaveLength(1);
    expect(wrapper.emitted('edit')?.[0]).toEqual([]);
  });

  it('shows delete button and emits event by click', async () => {
    expect(wrapper.find(chipDelete).exists()).toBe(false);

    await wrapper.setProps({ isDelete: true });

    expect(wrapper.find(chipDelete).exists()).toBe(true);

    await wrapper.find(chipDelete).trigger('click');

    expect(wrapper.emitted('delete')).toHaveLength(1);
    expect(wrapper.emitted('delete')?.[0]).toEqual([]);
  });
});
