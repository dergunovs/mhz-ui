import { Meta, StoryObj } from '@storybook/vue3';

import { html } from '@/utils';
import { UiClose } from '@/components';

const meta: Meta<typeof UiClose> = {
  component: UiClose,
  args: {},
  parameters: {
    docs: {
      description: {
        component: '',
      },
    },
  },
};

const argTypes = {};

type Story = StoryObj<typeof UiClose>;

export default meta;

export const Primary: Story = {
  render: (args) => ({
    components: { UiClose },
    setup: () => ({ args, argTypes }),

    template: html` <UiClose v-bind="args">{{DEFAULT_SLOT}}</UiClose>`,
  }),
  argTypes,
};
