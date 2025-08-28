import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { DEFAULT_SLOT } from './constants';
import IconTest from './icons/test.svg?component';

import { UiButton } from '@/components';

const meta: Meta<typeof UiButton> = {
  component: UiButton,
  args: {},
  argTypes: {
    layout: {
      options: ['primary', 'secondary', 'plain', 'accent', 'gradient'],
    },
    type: {
      options: ['submit', 'button'],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof UiButton> = {
  render: (args) => ({
    components: { UiButton },
    setup: () => ({ args, DEFAULT_SLOT }),

    template: html` <UiButton v-bind="args">{{DEFAULT_SLOT}}</UiButton>`,
  }),
};

export const Icon: StoryObj<typeof UiButton> = {
  render: (args) => ({
    components: { UiButton },
    setup: () => ({ args, DEFAULT_SLOT, IconTest }),

    template: html` <UiButton v-bind="args" :icon="IconTest">{{DEFAULT_SLOT}}</UiButton>`,
  }),
};
