import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { isTall, modelValue, options, title, isInput, isScrollable } from './constants';

import { UiButtongroup } from '@/components';

const meta: Meta<typeof UiButtongroup> = {
  component: UiButtongroup,
  args: {
    isTall,
    modelValue,
    options,
    title,
    isInput,
    isScrollable,
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiButtongroup> = {
  render: (args, { updateArgs }) => ({
    components: { UiButtongroup },
    setup: () => ({ args, updateArgs }),

    template: html` <UiButtongroup v-bind="args" @update:modelValue="update" />`,

    methods: {
      update(value: number) {
        updateArgs({ modelValue: value });
      },
    },
  }),
};
