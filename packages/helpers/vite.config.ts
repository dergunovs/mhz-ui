/// <reference types="vitest/config" />

import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';

const composables = fs
  .readdirSync('./src/composables')
  .filter((file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'))
  .reduce<{ [key: string]: string }>((obj, file) => {
    const name = file.replace('.ts', '');

    obj[name] = `src/composables/${file}`;

    return obj;
  }, {});

const helpers = fs
  .readdirSync('./src/helpers')
  .filter((file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'))
  .reduce<{ [key: string]: string }>((obj, file) => {
    const name = file.replace('.ts', '');

    obj[name] = `src/helpers/${file}`;

    return obj;
  }, {});

export default defineConfig({
  build: {
    target: 'es2022',
    copyPublicDir: false,
    lib: {
      name: 'mhz-helpers',
      entry: { ...composables, ...helpers },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        entryFileNames: `[name]/index.js`,
        assetFileNames: `[name]/[name].[ext]`,
        globals: { vue: 'Vue' },
      },
    },
  },

  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },

  plugins: [
    vue(),
    dts({
      entryRoot: './src',
      exclude: ['**/*.spec.ts'],
    }),
    {
      name: 'generate-index-files-and-copy-dts',
      apply: 'build',
      closeBundle() {
        const distDir = path.resolve('dist');

        const moveDts = (subDir: string) => {
          const dir = path.join(distDir, subDir);

          if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir).filter((f: string) => f.endsWith('.d.ts'));

            for (const file of files) {
              const src = path.join(dir, file);
              const name = file.replace('.d.ts', '');
              const destDir = path.join(distDir, name);

              if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

              const dest = path.join(destDir, 'index.d.ts');

              fs.renameSync(src, dest);
            }

            fs.rmdirSync(dir);
          }
        };

        moveDts('composables');
        moveDts('helpers');

        const srcIndexPath = path.resolve('src/index.ts');
        const distIndexJsPath = path.join(distDir, 'index.js');
        const distIndexDtsPath = path.join(distDir, 'index.d.ts');

        const contents = fs.readFileSync(srcIndexPath, 'utf8');

        const transformedJsContents = contents
          .toString()
          .replace(
            /export \* from '\.\/composables\/([^']*)';/g,
            (_match, name) => `export * from './${name}/index.js';`
          )
          .replace(/export \* from '\.\/helpers\/([^']*)';/g, (_match, name) => `export * from './${name}/index.js';`);

        fs.writeFileSync(distIndexJsPath, transformedJsContents);

        let transformedDtsContents = contents.toString().replace(/.ts/g, '');

        transformedDtsContents = transformedDtsContents.replace(
          /export \* from '\.\/composables\/([^']*)';/g,
          "export * from './$1';"
        );
        transformedDtsContents = transformedDtsContents.replace(
          /export \* from '\.\/helpers\/([^']*)';/g,
          "export * from './$1';"
        );

        fs.writeFileSync(distIndexDtsPath, transformedDtsContents);
      },
    },
  ],

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
