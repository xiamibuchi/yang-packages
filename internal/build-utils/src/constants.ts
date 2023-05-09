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
