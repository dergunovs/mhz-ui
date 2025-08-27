// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path';
import type { StorybookConfig } from '@storybook/vue3-vite';

// eslint-disable-next-line unicorn/prefer-module
const requirePath = typeof require === 'undefined' ? import.meta : require;

function getAbsolutePath(packageName: string) {
  return path.dirname(requirePath.resolve(path.join(packageName, 'package.json'))).replace(/^file:\/\//, '');
}

const config: StorybookConfig = {
  framework: { name: getAbsolutePath('@storybook/vue3-vite'), options: {} },

  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: ['@storybook/addon-docs'],

  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
};

export default config;
