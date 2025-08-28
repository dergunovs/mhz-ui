import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { HEADERS, MODEL_VALUE, DEFAULT_SLOT } from './constants';

import { UiTable } from '@/components';

const meta: Meta<typeof UiTable> = {
  component: UiTable,
  args: {
    headers: HEADERS,
    modelValue: MODEL_VALUE,
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiTable> = {
  render: (args, { updateArgs }) => ({
    components: { UiTable },
    setup: () => ({ args, updateArgs, DEFAULT_SLOT }),

    template: html` <UiTable v-bind="args" @update:modelValue="update">
      <tr>
        <td>1</td>
        <td>Frosinone</td>
        <td>Frosinone.it</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Genoa</td>
        <td>Genoa.it</td>
      </tr>
    </UiTable>`,

    methods: {
      update(sort: { value: string; dir: 'asc' | 'desc' }) {
        updateArgs({ modelValue: { ...sort } });
      },
    },
  }),
};
