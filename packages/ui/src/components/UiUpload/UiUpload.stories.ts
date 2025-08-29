import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { LABEL } from './constants';

import { UiUpload } from '@/components';

let files: File[] = [];
let file: File | undefined;

const meta: Meta<typeof UiUpload> = {
  component: UiUpload,
  args: {
    label: LABEL,
    files,
    file,
  },
  argTypes: {
    lang: {
      options: ['en', 'ru'],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof UiUpload> = {
  render: (args, { updateArgs }) => ({
    components: { UiUpload },
    setup: () => ({ args, updateArgs }),

    template: html` <UiUpload v-bind="args" @remove="remove($event)" @add="add($event)" /> `,

    methods: {
      remove(fileToRemove: File) {
        const newFiles = files.filter((fileExisting: File) => fileExisting.name !== fileToRemove.name);

        updateArgs({ files: [...newFiles] });
        files = [...newFiles];
      },

      add(fileToAdd: File) {
        updateArgs({ files: [...files, fileToAdd] });
        files = [...files, fileToAdd];
      },
    },
  }),
};

export const SingleFile: StoryObj<typeof UiUpload> = {
  render: (args, { updateArgs }) => ({
    components: { UiUpload },
    setup: () => ({ args, updateArgs }),

    template: html` <UiUpload v-bind="args" isSingle @remove="remove($event)" @add="add($event)" /> `,

    methods: {
      remove() {
        updateArgs({ file: undefined });
        file = undefined;
      },

      add(fileToAdd: File) {
        updateArgs({ file: fileToAdd });
        file = fileToAdd;
      },
    },
  }),
};
