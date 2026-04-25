import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiRange from './UiRange.vue';
import { MIN, MAX, MODEL_VALUE } from './constants';

import { wrapperFactory } from '@/test';

const rangeMin = dataTest('ui-range-min');
const rangeMax = dataTest('ui-range-max');

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

  it('has two range inputs with correct attributes', async () => {
    const minInput = wrapper.find(rangeMin);
    const maxInput = wrapper.find(rangeMax);

    expect(minInput.exists()).toBe(true);
    expect(maxInput.exists()).toBe(true);
    expect(minInput.attributes('min')).toBe(MIN.toString());
    expect(minInput.attributes('max')).toBe(MAX.toString());
    expect(minInput.attributes('value')).toBe(MODEL_VALUE[0].toString());
    expect(maxInput.attributes('value')).toBe(MODEL_VALUE[1].toString());
  });

  it('emits update:modelValue event when min slider value changes', async () => {
    const newValue: [number, number] = [200, 600];

    wrapper.find(rangeMin).setValue(newValue[0]);

    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([newValue]);
  });

  it('emits update:modelValue event when max slider value changes', async () => {
    const newValue: [number, number] = [100, 700];

    wrapper.find(rangeMax).setValue(newValue[1]);

    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([newValue]);
  });

  it('prevents min value from exceeding max value', async () => {
    wrapper.find(rangeMin).setValue(800);

    await nextTick();

    const emitted = wrapper.emitted<[[number, number]]>('update:modelValue');

    expect(emitted?.[0]?.[0]?.[0]).toBeLessThanOrEqual(MODEL_VALUE[1]);
  });

  it('prevents max value from being less than min value', async () => {
    wrapper.find(rangeMax).setValue(50);

    await nextTick();

    const emitted = wrapper.emitted<[[number, number]]>('update:modelValue');

    expect(emitted?.[0]?.[0]?.[1]).toBeGreaterThanOrEqual(MODEL_VALUE[0]);
  });

  it('updates local values when modelValue changes externally', async () => {
    const newValue: [number, number] = [300, 700];

    await wrapper.setProps({ modelValue: newValue });

    expect(wrapper.find(rangeMin).attributes('value')).toBe(newValue[0].toString());
    expect(wrapper.find(rangeMax).attributes('value')).toBe(newValue[1].toString());
  });
});
