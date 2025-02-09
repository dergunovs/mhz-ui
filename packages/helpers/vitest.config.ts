import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    cache: false,
    clearMocks: true,
    include: ['**/*.spec.ts'],
    coverage: { provider: 'istanbul', reporter: ['text'], all: true },
    env: { TZ: 'UTC' },
  },
});
