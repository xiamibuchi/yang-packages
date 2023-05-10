import { resolve } from 'path';

export const PROJECT_ROOT = resolve(__dirname, '..', '..', '..');
export const PACKAGE_ROOT = resolve(PROJECT_ROOT, 'packages');

export const SRC_DIR_NAME = 'src';
export const STYLE_DIR_NAME = 'style';
export const VUE_COMPONENTS_NAME = 'vue-components';

/** `/packages` */
export const LOCALE_ROOT = resolve(PACKAGE_ROOT, 'locale');
export const VUE_COMPONENTS_ROOT = resolve(PACKAGE_ROOT, VUE_COMPONENTS_NAME);
export const VUE_COMPONENTS_SRC_ROOT = resolve(
  VUE_COMPONENTS_ROOT,
  SRC_DIR_NAME
);
export const VUE_COMPONENTS_PACKAGE_FILE = resolve(
  VUE_COMPONENTS_ROOT,
  'package.json'
);

/** `/dist` */
export const BUILD_OUTPUT = resolve(PROJECT_ROOT, 'dist');
export const VUE_COMPONENTS_OUTPUT = resolve(BUILD_OUTPUT, VUE_COMPONENTS_NAME);
export const VUE_COMPONENTS_ES_OUTPUT = resolve(VUE_COMPONENTS_OUTPUT, 'es');
