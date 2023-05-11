import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import vue from '@vitejs/plugin-vue';
import VueMacros from 'unplugin-vue-macros/rollup';
import vueJsx from '@vitejs/plugin-vue-jsx';
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild';
import { parallel } from 'gulp';
import glob from 'fast-glob';
import { camelCase, upperFirst } from 'lodash-es';
import {
  localeRoot,
  vueComponentsCamelcaseLocalName,
  vueComponentsCamelcaseName,
  vueComponentsOutput,
  vueComponentsRoot,
} from '@syseven/build-utils';
import { XiamiAlias } from '../plugins/xiami-alias-plugin';
import {
  formatBundleFilename,
  generateExternal,
  withTaskName,
  writeBundles,
} from '../utils';
import { target } from '../build-info';
import type { Plugin } from 'rollup';

const banner = `/*! sy-xiami */\n`;

async function buildFullEntry(minify: boolean) {
  const plugins: Plugin[] = [
    XiamiAlias(),
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue({
          isProduction: true,
        }),
        vueJsx: vueJsx(),
      },
    }),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts'],
    }),
    commonjs(),
    esbuild({
      exclude: [],
      sourceMap: minify,
      target,
      loaders: {
        '.vue': 'ts',
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      treeShaking: true,
      legalComments: 'eof',
    }),
  ];
  if (minify) {
    plugins.push(
      minifyPlugin({
        target,
        sourceMap: true,
      })
    );
  }

  const bundle = await rollup({
    input: path.resolve(vueComponentsRoot, 'index.ts'),
    plugins,
    external: await generateExternal({ full: true }),
    treeshake: true,
  });
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(
        vueComponentsOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'js')
      ),
      exports: 'named',
      name: vueComponentsCamelcaseName,
      globals: {
        vue: 'Vue',
      },
      sourcemap: minify,
      banner,
    },
    {
      format: 'esm',
      file: path.resolve(
        vueComponentsOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'mjs')
      ),
      sourcemap: minify,
      banner,
    },
  ]);
}

async function buildFullLocale(minify: boolean) {
  const files = await glob(`**/*.ts`, {
    cwd: path.resolve(localeRoot, 'lang'),
    absolute: true,
  });
  return Promise.all(
    files.map(async (file) => {
      const filename = path.basename(file, '.ts');
      const name = upperFirst(camelCase(filename));

      const bundle = await rollup({
        input: file,
        plugins: [
          esbuild({
            minify,
            sourceMap: minify,
            target,
          }),
        ],
      });
      await writeBundles(bundle, [
        {
          format: 'umd',
          file: path.resolve(
            vueComponentsOutput,
            'dist/locale',
            formatBundleFilename(filename, minify, 'js')
          ),
          exports: 'default',
          name: `${vueComponentsCamelcaseLocalName}${name}`,
          sourcemap: minify,
          banner,
        },
        {
          format: 'esm',
          file: path.resolve(
            vueComponentsOutput,
            'dist/locale',
            formatBundleFilename(filename, minify, 'mjs')
          ),
          sourcemap: minify,
          banner,
        },
      ]);
    })
  );
}

export const buildFull = (minify: boolean) => async () =>
  Promise.all([buildFullEntry(minify), buildFullLocale(minify)]);

export const buildFullBundle = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFull', buildFull(false))
);
