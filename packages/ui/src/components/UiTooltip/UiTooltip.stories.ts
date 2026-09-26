import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';
import { ref } from 'vue';

import { DEFAULT_POSITION, DEFAULT_SLOT } from './constants';

import { UiTooltip } from '@/components';

const meta: Meta<typeof UiTooltip> = {
  component: UiTooltip,
  args: {
    modelValue: false,
    position: DEFAULT_POSITION,
  },
  argTypes: {
    position: {
      options: ['top', 'bottom'],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof UiTooltip> = {
  render: (args, { updateArgs }) => ({
    components: { UiTooltip },
    setup: () => {
      const targetRef = ref<HTMLElement | null>(null);

      function update(isValue: boolean) {
        updateArgs({ modelValue: isValue });
      }

      return { args, targetRef, update, DEFAULT_SLOT };
    },

    template: html`
      <div>
        <button ref="targetRef" type="button" @mouseenter="update(true)" @mouseleave="update(false)">Hover me</button>

        <UiTooltip v-bind="args" :target="targetRef" @update:modelValue="update">{{ DEFAULT_SLOT }}</UiTooltip>
      </div>
    `,
  }),
};
