import { Meta, StoryObj } from '@storybook/vue3';
import { useArgs } from 'storybook/preview-api';

import { isTall, modelValue, options, title, isInput } from './constants';

import { html } from '@/utils';
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
  parameters: {
    docs: {
      description: {
        component: '',
      },
    },
  },
};

const argTypes = {};

type Story = StoryObj<typeof UiChoice>;

export default meta;

export const Primary: Story = {
  render: (args, { updateArgs }) => ({
    components: { UiChoice },
    setup: () => ({ args, argTypes, updateArgs }),

    template: html` <UiChoice v-bind="args" @update:modelValue="update" />`,

    methods: {
      update(value: number) {
        updateArgs({ modelValue: value });
      },
    },
  }),

  decorators: [
    (story, context) => {
      const [args, updateArgs] = useArgs();

      return story({ ...context, updateArgs, args });
    },
  ],

  argTypes,
};
