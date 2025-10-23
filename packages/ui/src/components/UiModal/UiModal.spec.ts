import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest, wait } from 'mhz-helpers';

import UiModal from './UiModal.vue';
import { IS_CONFIRM, DEFAULT_SLOT } from './constants';

import { wrapperFactory } from '@/test';

const modal = dataTest('ui-modal');
const modalDialog = dataTest('ui-modal-dialog');
const modalBackdrop = dataTest('ui-modal-backdrop');
const modalClose = dataTest('ui-modal-close');
const modalSlot = dataTest('ui-modal-slot');
const modalConfirm = dataTest('ui-modal-confirm');
const modalCancel = dataTest('ui-modal-cancel');

let wrapper: VueWrapper<InstanceType<typeof UiModal>>;

beforeEach(() => {
  wrapper = wrapperFactory(UiModal, { modelValue: false, isConfirm: IS_CONFIRM }, { default: DEFAULT_SLOT });
});

enableAutoUnmount(afterEach);

describe('UiModal', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UiModal)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('shows modal by modelValue props', async () => {
    expect(wrapper.find(modalBackdrop).exists()).toBe(false);
    expect(wrapper.find(modalDialog).exists()).toBe(false);

    await wrapper.setProps({ modelValue: true });
    await wait(100);

    expect(wrapper.find(modalBackdrop).exists()).toBe(true);
    expect(wrapper.find(modalDialog).exists()).toBe(true);
  });

  it('hides modal by close button click', async () => {
    await wrapper.setProps({ modelValue: true });
    await wait(100);

    expect(wrapper.find(modalClose).exists()).toBe(true);

    await wrapper.find(modalClose).trigger('click');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('hides modal by backdrop click', async () => {
    await wrapper.setProps({ modelValue: true });
    await wait(100);

    expect(wrapper.find(modalBackdrop).exists()).toBe(true);

    await wrapper.find(modalBackdrop).trigger('mousedown');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('shows slot content', async () => {
    await wrapper.setProps({ modelValue: true });
    await wait(100);

    expect(wrapper.find(modalSlot).text()).toBe(DEFAULT_SLOT);
  });

  it('shows confirm and cancel buttons in confirm mode', async () => {
    await wrapper.setProps({ modelValue: true, isConfirm: true });
    await wait(100);

    expect(wrapper.find(modalConfirm).exists()).toBe(true);
    expect(wrapper.find(modalCancel).exists()).toBe(true);
  });

  it('sets lang for buttons', async () => {
    await wrapper.setProps({ modelValue: true, isConfirm: true });
    await wait(100);

    expect(wrapper.findComponent(modalConfirm).text()).toBe('Подтвердить');
    expect(wrapper.findComponent(modalCancel).text()).toBe('Отмена');

    await wrapper.setProps({ lang: 'en' });
    await wait(100);

    expect(wrapper.findComponent(modalConfirm).text()).toBe('Confirm');
    expect(wrapper.findComponent(modalCancel).text()).toBe('Cancel');
  });

  it('hides by cancel button click in confirm mode', async () => {
    await wrapper.setProps({ modelValue: true, isConfirm: true });
    await wait(100);

    await wrapper.find(modalCancel).trigger('click');

    expect(wrapper.emitted()).not.toHaveProperty('confirm');
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('emit confirm and hides by confirm button click in confirm mode', async () => {
    await wrapper.setProps({ modelValue: true, isConfirm: true });
    await wait(100);

    await wrapper.find(modalConfirm).trigger('click');

    expect(wrapper.emitted('confirm')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('closes on escape key press (cancel event)', async () => {
    await wrapper.setProps({ modelValue: true });
    await wait(100);

    const dialogElement = wrapper.find(modalDialog).element as HTMLDialogElement;

    expect(dialogElement.open).toBe(true);

    dialogElement.dispatchEvent(new Event('cancel', { cancelable: true }));

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('toggles dialog correctly on modelValue change', async () => {
    await wrapper.setProps({ modelValue: true });
    await wait(100);

    const dialogElement = wrapper.find(modalDialog).element as HTMLDialogElement;

    expect(dialogElement.open).toBe(true);

    await wrapper.setProps({ modelValue: false });
    await wait(100);

    const updateEvents = wrapper.emitted('update:modelValue');

    if (updateEvents) expect(updateEvents.at(-1)).toEqual([false]);
  });

  it('renders with correct scrollable attribute', async () => {
    await wrapper.setProps({ modelValue: true, isScrollable: true });
    await wait(100);

    expect(wrapper.find(modal).attributes('data-scrollable')).toBe('true');

    await wrapper.setProps({ isScrollable: false });
    await wait(100);

    expect(wrapper.find(modal).attributes('data-scrollable')).toBe('false');
  });
});
