import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { UiCheckbox } from '@/components';

const meta: Meta<typeof UiCheckbox> = {
  component: UiCheckbox,
  args: {
    modelValue: true,
    label: 'Label',
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiCheckbox> = {
  render: (args) => ({
    components: { UiCheckbox },
    setup: () => ({ args }),

    template: html` <UiCheckbox v-bind="args" /> `,
  }),
};
