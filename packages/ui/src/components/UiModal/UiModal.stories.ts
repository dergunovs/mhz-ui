import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { MODEL_VALUE, IS_CONFIRM } from './constants';

import { UiModal, UiButton } from '@/components';

const meta: Meta<typeof UiModal> = {
  component: UiModal,
  args: {
    modelValue: MODEL_VALUE,
    isConfirm: IS_CONFIRM,
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiModal> = {
  render: (args, { updateArgs }) => ({
    components: { UiModal, UiButton },
    setup: () => ({ args }),

    template: html`<div>
      <UiButton @click="update">Show modal</UiButton>
      <UiModal v-bind="args" @update:modelValue="update">Text inside</UiModal>
    </div>`,

    methods: {
      update(value: boolean) {
        updateArgs({ modelValue: value });
      },
    },
  }),
};
