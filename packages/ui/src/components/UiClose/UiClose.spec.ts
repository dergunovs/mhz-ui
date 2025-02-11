import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiClose from './UiClose.vue';

import { wrapperFactory } from '@/test';

const close = dataTest('ui-close');

let wrapper: VueWrapper<InstanceType<typeof UiClose>>;

beforeEach(() => {
  wrapper = wrapperFactory(UiClose);
});

enableAutoUnmount(afterEach);

describe('UiClose', async () => {
  it('exists', async () => {
    expect(wrapper.findComponent(UiClose)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('sets style props', async () => {
    expect(wrapper.find(close).attributes('data-small')).toBe('false');
    expect(wrapper.find(close).attributes('data-delete')).toBe('false');

    await wrapper.setProps({ isSmall: true, isDelete: true });

    expect(wrapper.find(close).attributes('data-small')).toBe('true');
    expect(wrapper.find(close).attributes('data-delete')).toBe('true');
  });
});
