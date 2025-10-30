import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  framework: '@storybook/vue3-vite',
  stories: ['../src/docs/*.mdx', '../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
};

export default config;
