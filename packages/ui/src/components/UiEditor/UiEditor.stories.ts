import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { MODEL_VALUE } from './constants';

import { UiEditor } from '@/components';

const meta: Meta<typeof UiEditor> = {
  component: UiEditor,
  args: {
    modelValue: MODEL_VALUE,
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiEditor> = {
  render: (args) => ({
    components: { UiEditor },
    setup: () => ({ args }),

    template: html` <UiEditor v-bind="args" />`,
  }),
};
