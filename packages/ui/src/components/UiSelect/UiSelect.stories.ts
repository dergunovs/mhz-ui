import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { MODEL_VALUE, IS_FILTER, OPTIONS_OBJECTS } from './constants';

import { UiSelect } from '@/components';

const meta: Meta<typeof UiSelect> = {
  component: UiSelect,
  args: {
    modelValue: MODEL_VALUE,
    options: OPTIONS_OBJECTS,
    isFilter: IS_FILTER,
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiSelect> = {
  render: (args, { updateArgs }) => ({
    components: { UiSelect },
    setup: () => ({ args, updateArgs }),

    template: html` <UiSelect v-bind="args" @update:modelValue="update" />`,

    methods: {
      update(option: string) {
        updateArgs({ modelValue: option });
      },
    },
  }),
};

export const Filter: StoryObj<typeof UiSelect> = {
  render: (args, { updateArgs }) => ({
    components: { UiSelect },
    setup: () => ({ args, updateArgs }),

    template: html` <UiSelect v-bind="args" @update:modelValue="update" isFilter />`,

    methods: {
      update(option: string) {
        updateArgs({ modelValue: option });
      },
    },
  }),
};
