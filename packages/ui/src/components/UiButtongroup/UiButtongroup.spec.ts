import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { nextTick } from 'vue';

import { dataTest } from 'mhz-helpers';

import UiButtongroup from './UiButtongroup.vue';

import { isTall, modelValue, options, title, isInput, isScrollable } from './constants';
import { wrapperFactory } from '@/test';

const titleText = dataTest('ui-choice-title');
const buttons = dataTest('ui-choice-buttons');
const scroll = dataTest('ui-choice-scroll');
const button = dataTest('ui-choice-button');
const input = dataTest('ui-choice-input');

enableAutoUnmount(afterEach);

describe('UiButtongroup', async () => {
  let wrapper: VueWrapper<InstanceType<typeof UiButtongroup>>;

  beforeEach(() => {
    wrapper = wrapperFactory(UiButtongroup, { options, modelValue, title, isTall, isInput, isScrollable });
  });

  it('exists', async () => {
    expect(wrapper.findComponent(UiButtongroup)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows title', async () => {
    expect(wrapper.find(titleText).text()).toBe(title);
  });

  it('shows tall buttons by props', async () => {
    expect(wrapper.find(buttons).attributes('data-tall')).toBe(isTall.toString());

    await wrapper.setProps({ isTall: false });

    expect(wrapper.find(buttons).attributes('data-tall')).toBe('false');
  });

  it('shows buttons when not scrollable', async () => {
    await wrapper.setProps({ isScrollable: false });

    expect(wrapper.findAll(button)).toHaveLength(options.length);
    expect(wrapper.find(button).text()).toBe(options[0].toString());
    expect(wrapper.find(button).attributes('data-current')).toBe((modelValue === options[0]).toString());
  });

  it('shows all options when scrollable', async () => {
    await wrapper.setProps({ isScrollable: true });

    expect(wrapper.findAll(button)).toHaveLength(99);
    expect(wrapper.find(button).text()).toBe('1');
    expect(wrapper.find(scroll).attributes('data-scrollable')).toBe('true');
  });

  it('shows input', async () => {
    expect(wrapper.find(input).attributes('value')).toBe(modelValue.toString());
  });

  it('shows input when scrollable', async () => {
    await wrapper.setProps({ isScrollable: true });

    expect(wrapper.find(input).exists()).toBe(true);
    expect(wrapper.find(input).attributes('value')).toBe(modelValue.toString());
  });

  it('scrolls to the right by pointer drag', async () => {
    await wrapper.setProps({ isScrollable: true });

    await wrapper.find(scroll).trigger('pointerdown', { clientX: 100 });
    await wrapper.find(scroll).trigger('pointermove', { clientX: 50 });
    await wrapper.find(scroll).trigger('pointerup');

    expect(wrapper.find(scroll).element.scrollLeft).toBe(50);
  });

  it('scrolls to the left by pointer drag', async () => {
    await wrapper.setProps({ isScrollable: true });

    await wrapper.find(scroll).trigger('pointerdown', { clientX: 100 });
    await wrapper.find(scroll).trigger('pointermove', { clientX: 50 });
    await wrapper.find(scroll).trigger('pointerup');

    await wrapper.find(scroll).trigger('pointerdown', { clientX: 50 });
    await wrapper.find(scroll).trigger('pointermove', { clientX: 100 });
    await wrapper.find(scroll).trigger('pointerup');

    expect(wrapper.find(scroll).element.scrollLeft).toBe(0);
  });

  it('does not show a value below 1', async () => {
    await wrapper.setProps({ isScrollable: true });

    expect(wrapper.find(button).text()).toBe('1');
  });

  it('scrolls to center current value when modelValue changes', async () => {
    await wrapper.setProps({ isScrollable: true, modelValue: 1 });

    const scrollElement = wrapper.find(scroll).element as HTMLElement;
    const buttonElements = wrapper.findAll(button);
    const targetButton = buttonElements[6].element as HTMLElement;

    Object.defineProperty(scrollElement, 'clientWidth', { value: 500, configurable: true });
    Object.defineProperties(targetButton, {
      offsetLeft: { value: 600, configurable: true },
      offsetWidth: { value: 100, configurable: true },
    });

    await wrapper.setProps({ modelValue: 7 });
    await nextTick();

    expect(scrollElement.scrollLeft).toBe(400);
  });

  it('does not scroll below zero for first values', async () => {
    await wrapper.setProps({ isScrollable: true, modelValue: 7 });

    const scrollElement = wrapper.find(scroll).element as HTMLElement;
    const buttonElements = wrapper.findAll(button);
    const firstButton = buttonElements[0].element as HTMLElement;

    Object.defineProperty(scrollElement, 'clientWidth', { value: 500, configurable: true });
    Object.defineProperties(firstButton, {
      offsetLeft: { value: 0, configurable: true },
      offsetWidth: { value: 100, configurable: true },
    });

    await wrapper.setProps({ modelValue: 1 });
    await nextTick();

    expect(scrollElement.scrollLeft).toBe(0);
  });

  it('emits choosen value', async () => {
    await wrapper.setProps({ isScrollable: false });
    await wrapper.find(button).trigger('click');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([options[0]]);

    wrapper.find(input).setValue(options[1]);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(2);
    expect(wrapper.emitted()['update:modelValue'][1]).toStrictEqual([options[1]]);
  });
});
