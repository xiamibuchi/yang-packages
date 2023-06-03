import { provideGlobalConfig } from '@syseven/components/config-provider';
import { INSTALLED_KEY } from '@syseven/constants';
import { version } from './version';

import type { App, Plugin } from 'vue';
import type { ConfigProviderContext } from '@syseven/components/config-provider';

export type CustomApp = App & { [INSTALLED_KEY]?: boolean };

/**
 * @param Components
 */
export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: CustomApp, options?: ConfigProviderContext) => {
    if (app[INSTALLED_KEY]) return;

    app[INSTALLED_KEY] = true;
    components.forEach((c) => app.use(c));

    if (options) provideGlobalConfig(options, app, true);
  };

  return {
    version,
    install,
  };
};
