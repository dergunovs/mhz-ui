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
    rolldownOptions: {
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
        const allFiles = Object.keys(bundle);
        const cssFiles = allFiles.filter((f) => f.endsWith('.css'));
        const jsFiles = allFiles.filter((f) => f.endsWith('.js'));

        for (const cssFile of cssFiles) {
          const cssBasePath = cssFile.slice(0, -4);
          const cssFileName = path.basename(cssBasePath);

          const wrapperFile = jsFiles.find((file) => {
            const jsBasePath = file.slice(0, -3);
            const fileName = path.basename(jsBasePath);

            return jsBasePath === cssBasePath && !/-\w{8}$/.test(fileName);
          });

          if (!wrapperFile) continue;

          const wrapperContent = fs.readFileSync(path.resolve('dist', wrapperFile), 'utf8');
          const hashImportMatch = wrapperContent.match(
            new RegExp(String.raw`from\s+["']\.?\.?/(${cssFileName}-\w{8}\.js)["']`)
          );

          const targetFile = hashImportMatch ? hashImportMatch[1] : wrapperFile;

          if (!jsFiles.includes(targetFile)) continue;

          const jsDir = path.dirname(targetFile);
          const relativePath = path.relative(jsDir, cssFile).replace(/\\/g, '/');
          const cssPath = relativePath.startsWith('../') ? relativePath : `./${relativePath}`;
          const cssImport = `import "${cssPath}";`;

          const fullPath = path.resolve('dist', targetFile);
          const data = fs.readFileSync(fullPath, 'utf8');

          if (!data.includes(cssImport)) {
            fs.writeFileSync(fullPath, `${cssImport}\n${data}`);
          }
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
