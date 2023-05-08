import { PKG_PREFIX, styleName, vueComponentsName } from '@syseven/build-utils';
import { buildConfig } from '../build-info';

import type { Module } from '../build-info';

/** used for type generator */
export const pathRewriter = (module: Module) => {
  const config = buildConfig[module];

  return (id: string) => {
    id = id.replaceAll(
      `${PKG_PREFIX}/${styleName}`,
      `${vueComponentsName}/${styleName}`
    );
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`);
    return id;
  };
};
