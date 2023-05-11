import path from 'path';
import { vueComponentsName, vueComponentsOutput } from '@syseven/build-utils';

import type { ModuleFormat } from 'rollup';

export const modules = ['esm', 'cjs'] as const;
export type Module = (typeof modules)[number];
export interface BuildInfo {
  module: 'ESNext' | 'CommonJS';
  format: ModuleFormat;
  ext: 'mjs' | 'cjs' | 'js';
  output: {
    /** e.g: `es` */
    name: string;
    /** e.g: `dist/xiami/es` */
    path: string;
  };

  bundle: {
    /** e.g: `xiami/es` */
    path: string;
  };
}

export const buildConfig: Record<Module, BuildInfo> = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: path.resolve(vueComponentsOutput, 'es'),
    },
    bundle: {
      path: `${vueComponentsName}/es`,
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      path: path.resolve(vueComponentsOutput, 'lib'),
    },
    bundle: {
      path: `${vueComponentsName}/lib`,
    },
  },
};
export const buildConfigEntries = Object.entries(
  buildConfig
) as BuildConfigEntries;

export type BuildConfig = typeof buildConfig;
export type BuildConfigEntries = [Module, BuildInfo][];

export const target = 'ES2018';
