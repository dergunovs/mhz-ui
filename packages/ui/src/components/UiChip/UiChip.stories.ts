import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { DEFAULT_SLOT } from './constants';

import { UiChip } from '@/components';

const meta: Meta<typeof UiChip> = {
  component: UiChip,
  args: {},
  argTypes: {
    type: {
      options: ['default', 'success', 'error'],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof UiChip> = {
  render: (args) => ({
    components: { UiChip },
    setup: () => ({ args, DEFAULT_SLOT }),

    template: html` <div style="display:flex"><UiChip v-bind="args">{{DEFAULT_SLOT}}</UiChip></div>`,
  }),
};
