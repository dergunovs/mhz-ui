import { StoryContext } from '@storybook/vue3';
import { useArgs } from 'storybook/preview-api';
import { withThemeByClassName } from '@storybook/addon-themes';
import { PartialStoryFn } from 'storybook/internal/types';

import '@/assets/styles/main.scss';

window['IS_STORYBOOK'] = true;

export const parameters = { controls: { disableSaveFromUI: true } };

export const decorators = [
  withThemeByClassName({
    themes: { light: 'light', dark: 'dark' },
    defaultTheme: 'light',
  }),
  (story: PartialStoryFn, context: StoryContext) => {
    const [args, updateArgs] = useArgs();

    return story({ ...context, updateArgs, args });
  },
];
