import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { VueWrapper, enableAutoUnmount } from '@vue/test-utils';
import { dataTest } from 'mhz-helpers';

import UiTextarea from './UiTextarea.vue';
import { MODEL_VALUE } from './constants';

import { wrapperFactory } from '@/test';

const textarea = dataTest('ui-textarea');

enableAutoUnmount(afterEach);

describe('UiTextarea', async () => {
  let wrapper: VueWrapper<InstanceType<typeof UiTextarea>>;

  beforeEach(() => {
    wrapper = wrapperFactory(UiTextarea, { modelValue: MODEL_VALUE });
  });

  it('exists', async () => {
    expect(wrapper.findComponent(UiTextarea)).toBeTruthy();
  });

  it('matches snapshot', async () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('handles v-model behaviour', async () => {
    expect((wrapper.find(textarea).element as HTMLInputElement).value).toBe(MODEL_VALUE);

    const newValue = 'New value';

    await wrapper.find(textarea).setValue(newValue);

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([newValue]);
  });

  it('disables textarea by props', async () => {
    expect(wrapper.find(textarea).attributes('disabled')).toBeUndefined();

    await wrapper.setProps({ isDisabled: true });

    expect(wrapper.find(textarea).attributes('disabled')).toBe('');
  });
});
