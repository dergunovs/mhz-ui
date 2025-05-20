import { Meta, StoryObj } from '@storybook/vue3';

import { MODEL_VALUE } from './constants';

import { html } from '@/utils';
import { UiTextarea } from '@/components';

const meta: Meta<typeof UiTextarea> = {
  component: UiTextarea,
  args: {
    modelValue: MODEL_VALUE,
  },
  parameters: {
    docs: {
      description: {
        component: '',
      },
    },
  },
};

const argTypes = {};

type Story = StoryObj<typeof UiTextarea>;

export default meta;

export const Primary: Story = {
  render: (args) => ({
    components: { UiTextarea },
    setup: () => ({ args, argTypes }),

    template: html` <UiTextarea v-bind="args" />`,
  }),
  argTypes,
};
