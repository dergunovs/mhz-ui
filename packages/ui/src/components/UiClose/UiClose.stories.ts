import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { UiClose } from '@/components';

const meta: Meta<typeof UiClose> = {
  component: UiClose,
  args: {},
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiClose> = {
  render: (args) => ({
    components: { UiClose },
    setup: () => ({ args }),

    template: html` <UiClose v-bind="args">{{DEFAULT_SLOT}}</UiClose>`,
  }),
};
