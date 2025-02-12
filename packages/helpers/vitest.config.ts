import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    cache: false,
    clearMocks: true,
    environment: 'happy-dom',
    include: ['**/*.spec.ts'],
    coverage: { provider: 'istanbul', reporter: ['text'], all: true },
    env: { TZ: 'UTC' },
  },
});
