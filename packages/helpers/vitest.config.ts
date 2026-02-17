import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  test: {
    clearMocks: true,
    environment: 'happy-dom',
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      exclude: ['src/index.ts'],
    },
    css: false,
    server: {
      deps: { inline: [/^(?!.*vitest).*$/] },
    },
    env: { TZ: 'UTC' },
  },
});
