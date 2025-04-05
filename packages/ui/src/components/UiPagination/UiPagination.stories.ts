import { Meta, StoryObj } from '@storybook/vue3';

import { PAGE, TOTAL } from './constants';

import { html } from '@/utils';
import { UiPagination } from '@/components';

const meta: Meta<typeof UiPagination> = {
  component: UiPagination,
  args: {
    page: PAGE,
    total: TOTAL,
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

type Story = StoryObj<typeof UiPagination>;

export default meta;

export const Primary: Story = {
  render: (args) => ({
    components: { UiPagination },
    setup: () => ({ args, argTypes }),

    template: html` <UiPagination v-bind="args" />`,
  }),
  argTypes,
};
