import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { LINKS } from './constants';

import { UiBreadcrumbs } from '@/components';

const meta: Meta<typeof UiBreadcrumbs> = {
  component: UiBreadcrumbs,
  args: {
    links: LINKS,
  },
  argTypes: {
    color: {
      options: ['default', 'white'],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof UiBreadcrumbs> = {
  render: (args) => ({
    components: { UiBreadcrumbs },
    setup: () => ({ args }),

    template: html` <UiBreadcrumbs v-bind="args" />`,
  }),
};
