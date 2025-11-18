import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/vue3-vite';

function getAbsolutePath(packageName: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${packageName}/package.json`)));
}

const config: StorybookConfig = {
  framework: { name: getAbsolutePath('@storybook/vue3-vite'), options: {} },
  stories: ['../src/docs/*.mdx', '../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
};

export default config;
