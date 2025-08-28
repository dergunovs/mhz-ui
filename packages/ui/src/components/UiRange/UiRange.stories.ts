import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { MODEL_VALUE, MIN, MAX } from './constants';

import { UiRange } from '@/components';

const meta: Meta<typeof UiRange> = {
  component: UiRange,
  args: {
    modelValue: MODEL_VALUE,
    min: MIN,
    max: MAX,
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiRange> = {
  render: (args, { updateArgs }) => ({
    components: { UiRange },
    setup: () => ({ args, updateArgs }),

    template: html` <UiRange v-bind="args" @update:modelValue="update" /> `,

    methods: {
      update(value: [number, number]) {
        updateArgs({ modelValue: [...value] });
      },
    },
  }),
};
