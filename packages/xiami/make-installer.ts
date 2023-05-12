import { provideGlobalConfig } from '@syseven/components/config-provider';
import { INSTALLED_KEY } from '@syseven/constants';
import { version } from './version';

import type { App, Plugin } from 'vue';
import type { ConfigProviderContext } from '@syseven/components/config-provider';

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?: ConfigProviderContext) => {
    // @ts-ignore
    if (app[INSTALLED_KEY]) return;

    // @ts-ignore
    app[INSTALLED_KEY] = true;
    components.forEach((c) => app.use(c));

    if (options) provideGlobalConfig(options, app, true);
  };

  return {
    version,
    install,
  };
};
