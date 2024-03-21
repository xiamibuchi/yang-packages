import { withInstall } from '@syseven/utils';

import ConfigProvider from './src/config-provider';

export const SyConfigProvider = withInstall(ConfigProvider);
export default SyConfigProvider;

export * from './src/config-provider';
export * from './src/config-provider-props';
export * from './src/constants';
export * from './src/hooks/use-global-config';
