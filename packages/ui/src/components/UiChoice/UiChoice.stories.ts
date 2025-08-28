import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { isTall, modelValue, options, title, isInput } from './constants';

import { UiChoice } from '@/components';

const meta: Meta<typeof UiChoice> = {
  component: UiChoice,
  args: {
    isTall,
    modelValue,
    options,
    title,
    isInput,
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiChoice> = {
  render: (args, { updateArgs }) => ({
    components: { UiChoice },
    setup: () => ({ args, updateArgs }),

    template: html` <UiChoice v-bind="args" @update:modelValue="update" />`,

    methods: {
      update(value: number) {
        updateArgs({ modelValue: value });
      },
    },
  }),
};
