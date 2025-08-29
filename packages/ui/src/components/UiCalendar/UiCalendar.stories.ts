import { ref } from 'vue';
import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { EVENTS, LANG } from './constants';
import { ICalendarEvent } from './interface';

import { UiCalendar, UiModal } from '@/components';

const meta: Meta<typeof UiCalendar> = {
  component: UiCalendar,
  args: {
    events: EVENTS,
    lang: LANG,
  },
  argTypes: {
    lang: {
      options: ['en', 'ru'],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof UiCalendar> = {
  render: (args) => ({
    components: { UiCalendar, UiModal },
    setup: () => {
      const isShowModal = ref(false);
      const eventContent = ref();

      function handleEventClick(event: ICalendarEvent<object>) {
        eventContent.value = event.content;
        isShowModal.value = !isShowModal.value;
      }

      return { args, isShowModal, handleEventClick, eventContent };
    },

    template: html` <UiCalendar v-bind="args" @eventClick="handleEventClick" />
      <UiModal v-model="isShowModal">{{eventContent}}</UiModal>`,
  }),
};
