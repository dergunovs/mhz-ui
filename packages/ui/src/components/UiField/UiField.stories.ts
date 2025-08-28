import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { ERROR, LABEL } from './constants';

import { UiField, UiInput } from '@/components';

const meta: Meta<typeof UiField> = {
  component: UiField,
  args: {
    label: LABEL,
    error: ERROR,
    isRequired: true,
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiField> = {
  render: (args) => ({
    components: { UiField, UiInput },
    setup: () => ({ args }),

    template: html` <UiField v-bind="args">
      <UiInput modelValue="Text" />
    </UiField>`,
  }),
};
