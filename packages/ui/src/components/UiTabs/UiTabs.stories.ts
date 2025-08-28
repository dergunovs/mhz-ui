import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { TABS } from './constants';

import { UiTabs } from '@/components';

const meta: Meta<typeof UiTabs> = {
  component: UiTabs,
  args: {
    tabs: TABS,
  },
  argTypes: {},
};

type Story = StoryObj<typeof UiTabs>;

export default meta;

export const Primary: Story = {
  render: (args, { updateArgs }) => ({
    components: { UiTabs },
    setup: () => ({ args, updateArgs }),

    template: html` <UiTabs v-bind="args" @update:modelValue="update" />`,

    methods: {
      update(value: string) {
        updateArgs({ modelValue: value });
      },
    },
  }),
};
