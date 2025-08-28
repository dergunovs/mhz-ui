import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { MODEL_VALUE } from './constants';

import { UiInput } from '@/components';

const meta: Meta<typeof UiInput> = {
  component: UiInput,
  args: {
    modelValue: MODEL_VALUE,
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiInput> = {
  render: (args) => ({
    components: { UiInput },
    setup: () => ({ args }),

    template: html` <UiInput v-bind="args" />`,
  }),
};
