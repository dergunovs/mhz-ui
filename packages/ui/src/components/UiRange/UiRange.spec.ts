import { DefineComponent, nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiRange from './UiRange.vue';
import { MIN, MAX, MODEL_VALUE } from './constants';

import { wrapperFactory } from '@/test';

const range = dataTest('ui-range');

let wrapper: VueWrapper<InstanceType<typeof UiRange>>;

beforeEach(() => {
  wrapper = wrapperFactory(UiRange, { modelValue: MODEL_VALUE, min: MIN, max: MAX });
});

enableAutoUnmount(afterEach);

describe('UiRange', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UiRange)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('passes props to range component', async () => {
    expect(wrapper.find(range).attributes('modelvalue')).toBe(MODEL_VALUE.join(','));
    expect(wrapper.find(range).attributes('min')).toBe(MIN.toString());
    expect(wrapper.find(range).attributes('max')).toBe(MAX.toString());
  });

  it('emits update:modelValue event when slider value changes', async () => {
    const newValue: [number, number] = [200, 700];

    wrapper.findComponent<DefineComponent>(range).vm.$emit('update:modelValue', newValue);

    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([newValue]);
  });
});
