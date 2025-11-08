/// <reference types="vitest/config" />

import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { removeDataTest } from 'mhz-helpers';

const files = fs.readdirSync('./src/components').filter((file) => file.includes('Ui'));

const entry = files.reduce<{ [key: string]: string }>((obj, component) => {
  obj[component.split('.')[0]] = `src/components/${component}/${component}.vue`;

  return obj;
}, {});

entry.toast = `src/components/toast/toast.ts`;
entry.stubs = `src/components/stubs/stubs.ts`;

export default defineConfig({
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    copyPublicDir: false,
    lib: { entry, name: 'mhz-ui', formats: ['es'] },
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        entryFileNames: `[name]/[name].js`,
        assetFileNames: `[name]/[name].[ext]`,
        globals: { vue: 'Vue', 'vue-router': 'VueRouter' },
      },
    },
  },

  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },

  css: {
    preprocessorOptions: {
      scss: { additionalData: `@use "@/assets/styles/breakpoints" as *;` },
    },
  },

  plugins: [
    vue({
      template: {
        compilerOptions: { nodeTransforms: process.env.NODE_ENV === 'production' ? [removeDataTest] : [] },
      },
    }),
    svgLoader(),
    dts({
      cleanVueFileName: true,
      entryRoot: './src/components',
      exclude: ['**/*.spec.ts', '**/*.stories.ts', '**/*.css', '**/constants/**'],
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/components/index.ts',
          dest: '',
          rename: 'index.js',
          transform: (contents) =>
            contents
              .toString()
              .replace(/.(vue|ts)/g, '.js')
              .replace('./toast/toast', './toast/toast.js')
              .replace('./stubs/stubs', './stubs/stubs.js'),
        },
        {
          src: 'src/components/index.ts',
          dest: '',
          rename: 'index.d.ts',
          transform: (contents) => contents.toString().replace(/.(vue|ts)/g, ''),
        },
        { src: 'src/assets/styles/base.scss', dest: '' },
        { src: 'src/assets/styles/breakpoints.scss', dest: '' },
        { src: 'src/assets/styles/colors.scss', dest: '' },
        { src: 'src/assets/styles/fonts.scss', dest: '' },
        { src: 'src/assets/styles/transitions.scss', dest: '' },
      ],
    }),
    {
      name: 'add-css-link',
      apply: 'build',

      writeBundle(_option, bundle) {
        const cssFiles = Object.keys(bundle).filter((file) => file.endsWith('.css') && !file.includes('-'));

        for (const cssFile of cssFiles) {
          const jsFileName = cssFile.replace('.css', '');
          const filePath = path.resolve('dist', `${jsFileName}.js`);

          const cssFileName = path.basename(cssFile);
          const cssImport = `import "./${cssFileName}";`;
          const data = fs.readFileSync(filePath, 'utf8');

          fs.writeFileSync(filePath, `${cssImport}\n${data}`);
        }
      },
    },
  ],

  optimizeDeps: {
    include: ['vue', 'vue-router'],
  },

  test: {
    clearMocks: true,
    environment: 'happy-dom',
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/Ui*.vue', 'src/toast/toast.ts'],
    },
    css: false,
    server: {
      deps: { inline: [/^(?!.*vitest).*$/] },
    },
    env: { TZ: 'UTC' },
  },
});
