import { Meta, StoryObj } from '@storybook/vue3';
import { useArgs } from 'storybook/preview-api';

import { TABS } from './constants';

import { html } from '@/utils';
import { UiTabs } from '@/components';

const meta: Meta<typeof UiTabs> = {
  component: UiTabs,
  args: {
    tabs: TABS,
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

type Story = StoryObj<typeof UiTabs>;

export default meta;

export const Primary: Story = {
  render: (args, { updateArgs }) => ({
    components: { UiTabs },
    setup: () => ({ args, argTypes, updateArgs }),

    template: html` <UiTabs v-bind="args" @update:modelValue="update" />`,

    methods: {
      update(value: string) {
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
