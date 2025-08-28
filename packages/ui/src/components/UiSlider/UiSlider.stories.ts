import { Meta, StoryObj } from '@storybook/vue3';
import { html } from 'mhz-helpers';

import { UiSlider } from '@/components';

import slide1 from '@/components/UiSlider/images/1.jpg';
import slide2 from '@/components/UiSlider/images/2.jpg';
import slide3 from '@/components/UiSlider/images/3.jpg';

import thumb1 from '@/components/UiSlider/images/thumb-1.webp';
import thumb2 from '@/components/UiSlider/images/thumb-2.webp';
import thumb3 from '@/components/UiSlider/images/thumb-3.webp';

const meta: Meta<typeof UiSlider> = {
  component: UiSlider,
  args: {
    slides: [slide1, slide2, slide3],
    thumbs: [thumb1, thumb2, thumb3],
  },
  argTypes: {},
};

export default meta;

export const Primary: StoryObj<typeof UiSlider> = {
  render: (args) => ({
    components: { UiSlider },
    setup: () => ({ args }),

    template: html` <UiSlider v-bind="args" />`,
  }),
};
