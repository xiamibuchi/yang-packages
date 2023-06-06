import path from 'path';
import { copyFile, mkdir } from 'fs/promises';
import { copy } from 'fs-extra';
import { parallel, series } from 'gulp';
import {
  buildOutput,
  projRoot,
  styleName,
  vueComponentsOutput,
  vueComponentsPackage,
} from '@syseven/build-utils';
import { buildConfig, run, runTask, withTaskName } from './src';
import type { TaskFunction } from 'gulp';
import type { Module } from './src';

// @ts-ignore
if (!globalThis.__name) {
  // @ts-ignore
  globalThis.__name = (target, value) =>
    Object.defineProperty(target, 'name', { value, configurable: true });
}

export const copyFiles = () =>
  Promise.all([
    copyFile(
      vueComponentsPackage,
      path.join(vueComponentsOutput, 'package.json')
    ),
    copyFile(
      path.resolve(projRoot, 'README.md'),
      path.resolve(vueComponentsOutput, 'README.md')
    ),
    copyFile(
      path.resolve(projRoot, 'global.d.ts'),
      path.resolve(vueComponentsOutput, 'global.d.ts')
    ),
  ]);

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'packages');
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path)
    );

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done);
};

export const copyFullStyle = async () => {
  await mkdir(path.resolve(vueComponentsOutput, 'dist'), { recursive: true });
  await copyFile(
    path.resolve(vueComponentsOutput, `${styleName}/index.css`),
    path.resolve(vueComponentsOutput, 'dist/index.css')
  );
};

const taskSeries: any = series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () =>
    mkdir(vueComponentsOutput, { recursive: true })
  ),

  parallel(
    runTask('buildModules'),
    runTask('buildFullBundle'),
    runTask('generateTypesDefinitions'),
    runTask('buildHelper'),
    series(
      withTaskName('buildThemeChalk', () =>
        run(`pnpm run -C packages/${styleName} build`)
      ),
      copyFullStyle
    )
  ),

  parallel(copyTypesDefinitions, copyFiles)
);

export default taskSeries;

export * from './src';
