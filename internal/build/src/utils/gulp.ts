import { buildRoot } from '@syseven/build-utils';
import { run } from './process';

export const withTaskName = (name: string, fn: any) =>
  Object.assign(fn, { displayName: name });

export const runTask = (name: string) =>
  withTaskName(`shellTask:${name}`, () =>
    run(`pnpm run start ${name}`, buildRoot)
  );
