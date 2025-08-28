import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { TITLE, MODEL_VALUE } from './constants';

import { UiSpoiler } from '@/components';

const meta: Meta<typeof UiSpoiler> = {
  component: UiSpoiler,
  args: {
    title: TITLE,
    modelValue: MODEL_VALUE,
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiSpoiler> = {
  render: (args, { updateArgs }) => ({
    components: { UiSpoiler },
    setup: () => ({ args, updateArgs }),

    template: html` <UiSpoiler v-bind="args" @update:modelValue="update">Inner Content</UiSpoiler>`,

    methods: {
      update(value: boolean) {
        updateArgs({ modelValue: value });
      },
    },
  }),
};
