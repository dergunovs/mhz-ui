import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import ToastStory from '@/components/toast/ToastStory.vue';

const meta: Meta<typeof ToastStory> = {
  component: ToastStory,
  args: {},
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof ToastStory> = {
  render: (args) => ({
    components: { ToastStory },
    setup: () => ({ args }),

    template: html` <ToastStory />`,
  }),
};
