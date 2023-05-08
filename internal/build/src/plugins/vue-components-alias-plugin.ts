import { PKG_PREFIX, styleName, vueComponentsName } from '@syseven/build-utils';

import type { Plugin } from 'rollup';

export function ElementPlusAlias(): Plugin {
  const sourceThemeChalk = `${PKG_PREFIX}/${styleName}` as const;
  const bundleThemeChalk = `${vueComponentsName}/${styleName}` as const;

  return {
    name: 'vue-components-alias-plugin',
    resolveId(id) {
      if (!id.startsWith(sourceThemeChalk)) return;
      return {
        id: id.replaceAll(sourceThemeChalk, bundleThemeChalk),
        external: 'absolute',
      };
    },
  };
}
