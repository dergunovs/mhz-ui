import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { MODEL_VALUE, IS_SUCCESS, RESULTS, SEARCH_SCHEME } from './constants';

import { UiSearch } from '@/components';

const meta: Meta<typeof UiSearch> = {
  component: UiSearch,
  args: {
    modelValue: MODEL_VALUE,
    isSuccess: IS_SUCCESS,
    results: RESULTS,
    searchScheme: SEARCH_SCHEME,
  },
  argTypes: {
    lang: {
      options: ['en', 'ru'],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof UiSearch> = {
  render: (args, { updateArgs }) => ({
    components: { UiSearch },
    setup: () => ({ args, updateArgs }),

    template: html` <UiSearch v-bind="args" @update:modelValue="update" />`,

    methods: {
      update(value: string) {
        updateArgs({ modelValue: value });
      },
    },
  }),
};
