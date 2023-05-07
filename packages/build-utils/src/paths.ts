import { resolve } from 'path';

export const projRoot = resolve(__dirname, '..', '..', '..');
export const pkgRoot = resolve(projRoot, 'packages');

/** `/dist` */
export const buildOutput = resolve(projRoot, 'dist');
/** `/dist/vue-components` */
export const epOutput = resolve(buildOutput, 'vue-components');
