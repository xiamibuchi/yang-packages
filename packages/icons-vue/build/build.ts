import path from 'node:path';
import consola from 'consola';
import chalk from 'chalk';
import { build } from 'esbuild';
import vue from 'unplugin-vue/esbuild';
import { emptyDir } from 'fs-extra';
import { pathOutput, pathSrc } from './paths';
import type { BuildOptions, Format } from 'esbuild';

const buildBundle = () => {
  const getBuildOptions = (format: Format) => {
    const options: BuildOptions = {
      entryPoints: [
        path.resolve(pathSrc, 'index.ts'),
        path.resolve(pathSrc, 'global.ts'),
      ],
      target: 'es2018',
      platform: 'neutral',
      plugins: [
        vue({
          isProduction: true,
          sourceMap: false,
        }),
      ],
      bundle: true,
      format,
      minifySyntax: true,
      outdir: pathOutput,
    };
    options.external = ['vue'];
    return options;
  };
  const doBuild = async (minify: boolean) => {
    await Promise.all([
      build({
        ...getBuildOptions('esm'),
        entryNames: `[name]${minify ? '.min' : ''}`,
        minify,
      }),
      build({
        ...getBuildOptions('cjs'),
        entryNames: `[name]${minify ? '.min' : ''}`,
        outExtension: { '.js': '.cjs' },
        minify,
      }),
    ]);
  };

  return Promise.all([doBuild(true), doBuild(false)]);
};

consola.info(chalk.blue('cleaning dist...'));
await emptyDir(pathOutput);
consola.info(chalk.blue('building...'));
await buildBundle();
