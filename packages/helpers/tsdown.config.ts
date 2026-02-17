import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2022',
  platform: 'browser',
  external: ['vue', 'vue-router', /^@vue\//, /^@babel\//, 'vue-demi'],
  noExternal: ['axios', '@vueuse/integrations', '@tanstack/vue-query'],
  inlineOnly: false,
  dts: true,
  clean: true,
  unbundle: true,
});
