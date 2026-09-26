import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { DEFAULT_LANG, DEFAULT_MODEL_VALUE, DEFAULT_PLACEHOLDER, IS_DISABLED } from './constants';

import { UiDate } from '@/components';

const meta: Meta<typeof UiDate> = {
  component: UiDate,
  args: {
    modelValue: DEFAULT_MODEL_VALUE,
    placeholder: DEFAULT_PLACEHOLDER,
    isDisabled: IS_DISABLED,
    lang: DEFAULT_LANG,
  },
  argTypes: {
    lang: {
      options: ['en', 'ru'],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof UiDate> = {
  render: (args, { updateArgs }) => ({
    components: { UiDate },
    setup: () => ({ args, updateArgs }),

    template: html` <UiDate v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" />`,
  }),
};
