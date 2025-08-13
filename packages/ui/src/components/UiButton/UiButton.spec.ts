import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiButton from './UiButton.vue';

import { DEFAULT_LAYOUT, DEFAULT_TYPE, DEFAULT_ICON, DEFAULT_SLOT, DEFAULT_ARIA_LABEL } from './constants';

import IconTest from './icons/test.svg?component';

import { wrapperFactory } from '@/test';

const button = dataTest('ui-button');
const buttonIcon = dataTest('ui-button-icon');

let wrapper: VueWrapper<InstanceType<typeof UiButton>>;

beforeEach(() => {
  wrapper = wrapperFactory(
    UiButton,
    { layout: DEFAULT_LAYOUT, type: DEFAULT_TYPE, icon: DEFAULT_ICON },
    { default: DEFAULT_SLOT }
  );
});

enableAutoUnmount(afterEach);

describe('UiButton', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UiButton)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows text by slot', async () => {
    expect(wrapper.find(button).text()).toBe(DEFAULT_SLOT);
  });

  it('sets layout by props', async () => {
    expect(wrapper.find(button).attributes('data-layout')).toBe(DEFAULT_LAYOUT);

    const newLayout = 'gradient';

    await wrapper.setProps({ layout: newLayout });

    expect(wrapper.find(button).attributes('data-layout')).toBe(newLayout);
  });

  it('sets type by props', async () => {
    expect(wrapper.find(button).attributes('type')).toBe(DEFAULT_TYPE);

    const newType = 'submit';

    await wrapper.setProps({ type: newType });

    expect(wrapper.find(button).attributes('type')).toBe(newType);
  });

  it('shows icon by props', async () => {
    expect(wrapper.find(buttonIcon).exists()).toBe(false);

    await wrapper.setProps({ icon: IconTest });

    expect(wrapper.find(buttonIcon).exists()).toBe(true);
  });

  it('disables button by props', async () => {
    expect(wrapper.find(button).attributes('disabled')).toBe(undefined);

    await wrapper.setProps({ isDisabled: true });

    expect(wrapper.find(button).attributes('disabled')).toBe('');
  });

  it('sets narrow layout by props', async () => {
    expect(wrapper.find(button).attributes('data-narrow')).toBe('false');

    await wrapper.setProps({ isNarrow: true });

    expect(wrapper.find(button).attributes('data-narrow')).toBe('true');
  });

  it('sets tall layout by props', async () => {
    expect(wrapper.find(button).attributes('data-tall')).toBe('false');

    await wrapper.setProps({ isTall: true });

    expect(wrapper.find(button).attributes('data-tall')).toBe('true');
  });

  it('sets wrap layout by props', async () => {
    expect(wrapper.find(button).attributes('data-wrap')).toBe('false');

    await wrapper.setProps({ isWrap: true });

    expect(wrapper.find(button).attributes('data-wrap')).toBe('true');
  });

  it('sets aria-label attribute', async () => {
    expect(wrapper.find(button).attributes('aria-label')).toBe(DEFAULT_ARIA_LABEL);

    const newAriaLabel = 'Test button';

    await wrapper.setProps({ ariaLabel: newAriaLabel });

    expect(wrapper.find(button).attributes('aria-label')).toBe(newAriaLabel);
  });
});
