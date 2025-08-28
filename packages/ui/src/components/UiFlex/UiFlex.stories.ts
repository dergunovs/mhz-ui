import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { FIRST_SLOT, SECOND_SLOT } from './constants';

import { UiFlex } from '@/components';

const meta: Meta<typeof UiFlex> = {
  component: UiFlex,
  args: {},
  argTypes: {
    align: {
      options: ['normal', 'stretch', 'center', 'flex-start', 'flex-end'],
    },
    justify: {
      options: [
        'normal',
        'stretch',
        'center',
        'flex-start',
        'flex-end',
        'space-between',
        'space-around',
        'space-evenly',
      ],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof UiFlex> = {
  render: (args) => ({
    components: { UiFlex },
    setup: () => ({ args, FIRST_SLOT, SECOND_SLOT }),

    template: html` <UiFlex v-bind="args">
      <div>{{FIRST_SLOT}}</div>
      <div>{{SECOND_SLOT}}</div>
    </UiFlex>`,
  }),
};
