import { computed, getCurrentInstance, inject, provide, ref, unref } from 'vue';
import { keysOf } from '@syseven/utils';
import {
  defaultNamespace,
  namespaceContextKey,
  useNamespace,
} from '@syseven/hooks';
import { configProviderContextKey } from '../constants';

import type { MaybeRef } from '@vueuse/core';
import type { App, Ref } from 'vue';
import type { ConfigProviderContext } from '../constants';

const globalConfig = ref<ConfigProviderContext>();

export function useGlobalConfig<
  K extends keyof ConfigProviderContext,
  D extends ConfigProviderContext[K]
>(
  key: K,
  defaultValue?: D
): Ref<Exclude<ConfigProviderContext[K], undefined> | D>;
export function useGlobalConfig(): Ref<ConfigProviderContext>;
export function useGlobalConfig(
  key?: keyof ConfigProviderContext,
  defaultValue = undefined
) {
  const config = getCurrentInstance()
    ? inject(configProviderContextKey, globalConfig)
    : globalConfig;
  if (key) {
    return computed(() => config.value?.[key] ?? defaultValue);
  } else {
    return config;
  }
}

export function useGlobalComponentSettings(block: string) {
  const config = useGlobalConfig();

  const ns = useNamespace(
    block,
    computed(() => config.value?.namespace || defaultNamespace)
  );

  return {
    ns,
  };
}

export const provideGlobalConfig = (
  config: MaybeRef<ConfigProviderContext>,
  app?: App,
  global = false
) => {
  const inSetup = !!getCurrentInstance();
  const oldConfig = inSetup ? useGlobalConfig() : undefined;

  const provideFn = app?.provide ?? (inSetup ? provide : undefined);
  if (!provideFn) {
    return;
  }

  const context = computed(() => {
    const cfg = unref(config);
    if (!oldConfig?.value) {
      return cfg;
    }
    return mergeConfig(oldConfig.value, cfg);
  });
  // @ts-ignore
  provideFn(configProviderContextKey, context);
  // @ts-ignore
  provideFn(
    namespaceContextKey,
    computed(() => context.value.namespace)
  );

  if (global || !globalConfig.value) {
    globalConfig.value = context.value;
  }
  return context;
};

const mergeConfig = (
  a: ConfigProviderContext,
  b: ConfigProviderContext
): ConfigProviderContext => {
  const keys = [...new Set([...keysOf(a), ...keysOf(b)])];
  const obj: Record<string, any> = {};
  for (const key of keys) {
    obj[key] = b[key] ?? a[key];
  }
  return obj;
};
