import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { MODEL_VALUE } from './constants';

import { UiTextarea } from '@/components';

const meta: Meta<typeof UiTextarea> = {
  component: UiTextarea,
  args: {
    modelValue: MODEL_VALUE,
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiTextarea> = {
  render: (args) => ({
    components: { UiTextarea },
    setup: () => ({ args }),

    template: html` <UiTextarea v-bind="args" />`,
  }),
};
