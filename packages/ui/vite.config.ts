/// <reference types="vitest" />

import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { removeDataTest } from 'mhz-helpers';

const files = fs.readdirSync('./src/components').filter((file) => file.includes('Ui'));

const components = files.reduce<{ [key: string]: string }>((obj, component) => {
  obj[component.split('.')[0]] = `src/components/${component}/${component}.vue`;

  return obj;
}, {});

components['toast'] = `src/components/toast/toast.ts`;
components['stubs'] = `src/components/stubs/stubs.ts`;

export default defineConfig({
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    copyPublicDir: false,
    lib: {
      name: 'mhz-ui',
      entry: components,
      formats: ['es'],
    },
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

      writeBundle(option, bundle) {
        const cssFiles = Object.keys(bundle)
          .filter((file) => file.endsWith('.css') && !file.includes('-'))
          .map((file) => file.replace('.css', ''));

        for (const file of cssFiles) {
          const filePath = path.resolve('', 'dist', `${file}.js`);
          const cssImport = `import "./${file.split('/')[0]}.css";`;
          const data = fs.readFileSync(filePath, { encoding: 'utf8' });

          fs.writeFileSync(filePath, `${cssImport}\n${data}`);
        }
      },
    },
    {
      name: 'manage-vue-cal-locales',
      apply: 'build',
      closeBundle() {
        const distPath = path.resolve('dist');
        const uiCalendarDir = path.join(distPath, 'UiCalendar');
        const distFiles = fs.readdirSync(distPath);

        const ruSourceFile = distFiles.find((file) => file.startsWith('ru-') && file.endsWith('.js'));
        const enGbSourceFile = distFiles.find((file) => file.startsWith('en-gb-') && file.endsWith('.js'));

        if (ruSourceFile && enGbSourceFile) {
          const ruSourcePath = path.join(distPath, ruSourceFile);
          const enGbSourcePath = path.join(distPath, enGbSourceFile);
          const ruDestPath = path.join(uiCalendarDir, 'ru.js');
          const enGbDestPath = path.join(uiCalendarDir, 'en.js');

          fs.copyFileSync(ruSourcePath, ruDestPath);
          fs.copyFileSync(enGbSourcePath, enGbDestPath);

          fs.unlinkSync(ruSourcePath);
          fs.unlinkSync(enGbSourcePath);
        }

        const updatedDistFiles = fs.readdirSync(distPath);

        const isProtectedFile = (file: string) => {
          const protectedPatterns = [
            /^index[-.][a-zA-Z0-9]+\.js$/,
            /^index\.js$/,
            /^_plugin-vue_export-helper-[a-zA-Z0-9]+\.js$/,
          ];

          return protectedPatterns.some((pattern) => pattern.test(file));
        };

        updatedDistFiles.forEach((file) => {
          if (!file.endsWith('.js')) return;
          if (isProtectedFile(file)) return;

          const isLocaleFile = /^[a-z]{2}(-[a-z0-9]+)?\.[a-zA-Z0-9]+\.js$/;

          if (isLocaleFile) {
            const filePath = path.join(distPath, file);

            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          }
        });

        const targetFilePath = path.resolve('dist/UiCalendar/UiCalendar.js');
        let content = fs.readFileSync(targetFilePath, 'utf8');

        const localeObjectMatch = content.match(
          /(let\s+S\s*=\s*\/\*\s*@__PURE__\s*\*\/\s*Object\.assign\(\s*\{[^}]*"\.\.\/i18n\/ar\.json"[\s\S]*?\}\)\s*;)/
        );

        if (!localeObjectMatch) return;
        const oldFullExpression = localeObjectMatch[1];
        const newFullExpression = `let S = /* @__PURE__ */ Object.assign({"../i18n/ru.json": () => import("./ru.js").then((r) => r.default),"../i18n/en-gb.json": () => import("./en.js").then((r) => r.default)});`;

        content = content.replace(oldFullExpression, newFullExpression);
        fs.writeFileSync(targetFilePath, content, 'utf8');
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
      provider: 'istanbul',
      reporter: ['text'],
      include: ['src/**/Ui*.vue', 'src/toast/toast.ts'],
      all: true,
    },
    css: false,
    deps: { inline: true },
    env: { TZ: 'UTC' },
  },
});
