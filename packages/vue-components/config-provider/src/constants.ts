import type { ConfigProviderPropsType } from './config-provider-props';
import type { InjectionKey, Ref } from 'vue';

export type ConfigProviderContext = Partial<ConfigProviderPropsType>;

export const configProviderContextKey: InjectionKey<
  Ref<ConfigProviderContext>
> = Symbol();
