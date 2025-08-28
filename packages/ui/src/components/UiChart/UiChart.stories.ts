import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { LABELS, DATASETS, TITLE, TYPE } from './constants';

import { UiChart } from '@/components';

const meta: Meta<typeof UiChart> = {
  component: UiChart,
  args: {
    labels: LABELS,
    datasets: DATASETS,
    title: TITLE,
    type: TYPE,
  },
  argTypes: {
    type: {
      options: ['Bar', 'Pie', 'Line'],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof UiChart> = {
  render: (args) => ({
    components: { UiChart },
    setup: () => ({ args }),

    template: html` <UiChart v-bind="args" />`,
  }),
};
