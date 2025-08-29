import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { PAGE, TOTAL } from './constants';

import { UiPagination } from '@/components';

const meta: Meta<typeof UiPagination> = {
  component: UiPagination,
  args: {
    page: PAGE,
    total: TOTAL,
  },
  argTypes: {
    lang: {
      options: ['en', 'ru'],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof UiPagination> = {
  render: (args) => ({
    components: { UiPagination },
    setup: () => ({ args }),

    template: html` <UiPagination v-bind="args" />`,
  }),
};
