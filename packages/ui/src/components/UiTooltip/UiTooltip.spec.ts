import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, wait } from 'mhz-helpers';

import UiTooltip from './UiTooltip.vue';

import { DEFAULT_SLOT, TOOLTIP_GAP } from './constants';

import { wrapperFactory } from '@/test';

const tooltip = dataTest('ui-tooltip');

const TOOLTIP_WIDTH = 100;
const TOOLTIP_HEIGHT = 40;
const WINDOW_INNER_WIDTH = 1024;

enableAutoUnmount(afterEach);

describe('UiTooltip', async () => {
  let wrapper: VueWrapper<InstanceType<typeof UiTooltip>>;

  beforeEach(() => {
    Object.defineProperties(HTMLDivElement.prototype, {
      offsetWidth: { configurable: true, value: TOOLTIP_WIDTH },
      offsetHeight: { configurable: true, value: TOOLTIP_HEIGHT },
    });

    Object.defineProperty(globalThis, 'innerWidth', {
      configurable: true,
      value: WINDOW_INNER_WIDTH,
    });

    wrapper = wrapperFactory(UiTooltip, { modelValue: false, target: null }, { default: DEFAULT_SLOT });
  });

  afterEach(() => {
    delete (HTMLDivElement.prototype as unknown as { offsetWidth?: number }).offsetWidth;
    delete (HTMLDivElement.prototype as unknown as { offsetHeight?: number }).offsetHeight;

    Object.defineProperty(globalThis, 'innerWidth', {
      configurable: true,
      value: WINDOW_INNER_WIDTH,
    });
  });

  it('exists', async () => {
    expect(wrapper.findComponent(UiTooltip)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('does not render tooltip when modelValue is false', async () => {
    expect(wrapper.find(tooltip).exists()).toBe(false);
  });

  it('renders tooltip when modelValue is true and target is set', async () => {
    await wrapper.setProps({ modelValue: true, target: document.body });
    await wait();

    expect(wrapper.find(tooltip).exists()).toBe(true);
  });

  it('shows slot content', async () => {
    await wrapper.setProps({ modelValue: true, target: document.body });
    await wait();

    expect(wrapper.find(tooltip).text()).toBe(DEFAULT_SLOT);
  });

  it('sets position to bottom by default', async () => {
    const target = createTargetMock({ top: 100, bottom: 120, left: 100, width: 40 });

    await wrapper.setProps({ modelValue: true, target });
    await wait();

    expect(wrapper.find(tooltip).attributes('style')).toContain(`top: ${120 + TOOLTIP_GAP}px`);
  });

  it('sets position to top', async () => {
    const target = createTargetMock({ top: 100, bottom: 120, left: 100, width: 40 });

    await wrapper.setProps({ modelValue: true, target, position: 'top' });
    await wait();

    expect(wrapper.find(tooltip).attributes('style')).toContain(`top: ${100 - TOOLTIP_HEIGHT - TOOLTIP_GAP}px`);
  });

  it('clamps left position to left window bound', async () => {
    const target = createTargetMock({ top: 100, bottom: 120, left: 0, width: 40 });

    await wrapper.setProps({ modelValue: true, target });
    await wait();

    expect(wrapper.find(tooltip).attributes('style')).toContain(`left: ${TOOLTIP_GAP}px`);
  });

  it('clamps left position to right window bound', async () => {
    const target = createTargetMock({ top: 100, bottom: 120, left: 980, width: 40 });

    await wrapper.setProps({ modelValue: true, target });
    await wait();

    const expectedLeft = WINDOW_INNER_WIDTH - TOOLTIP_WIDTH - TOOLTIP_GAP;

    expect(wrapper.find(tooltip).attributes('style')).toContain(`left: ${expectedLeft}px`);
  });

  it('closes on window resize', async () => {
    await wrapper.setProps({ modelValue: true, target: document.body });
    await wait();

    dispatchEvent(new Event('resize'));

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('closes on window scroll', async () => {
    await wrapper.setProps({ modelValue: true, target: document.body });
    await wait();

    dispatchEvent(new Event('scroll'));

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });
});

function createTargetMock(rect: { top: number; bottom: number; left: number; width: number }): HTMLElement {
  const element = document.createElement('div');

  element.getBoundingClientRect = () => ({
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.left + rect.width,
    width: rect.width,
    height: rect.bottom - rect.top,
    x: rect.left,
    y: rect.top,
    toJSON: () => ({}),
  });

  return element;
}
