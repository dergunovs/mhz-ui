import { Meta, StoryObj } from '@storybook/vue3';

import { MODEL_VALUE } from './constants';

import { html } from '@/utils';
import { UiEditor } from '@/components';

const meta: Meta<typeof UiEditor> = {
  component: UiEditor,
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

type Story = StoryObj<typeof UiEditor>;

export default meta;

export const Primary: Story = {
  render: (args) => ({
    components: { UiEditor },
    setup: () => ({ args, argTypes }),

    template: html` <UiEditor v-bind="args" />`,
  }),
  argTypes,
};
