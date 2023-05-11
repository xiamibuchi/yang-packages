import { resolve } from 'path';

export const projRoot = resolve(__dirname, '..', '..', '..');
export const pkgRoot = resolve(projRoot, 'packages');

export const styleName = 'style';
export const vueComponentsName = 'xiami';
export const vueComponentsLocalName = 'xiami-local';
export const vueComponentsCamelcaseName = 'VueComponents';
export const vueComponentsCamelcaseLocalName = 'VueComponents';
export const buildRoot = resolve(projRoot, 'internal', 'build');

/** `/packages` */
export const localeRoot = resolve(pkgRoot, 'locale');
export const vueComponentsRoot = resolve(pkgRoot, vueComponentsName);

/** `/dist` */
export const buildOutput = resolve(projRoot, 'dist');
export const vueComponentsOutput = resolve(buildOutput, vueComponentsName);

export const vueComponentsPackage = resolve(vueComponentsRoot, 'package.json');
