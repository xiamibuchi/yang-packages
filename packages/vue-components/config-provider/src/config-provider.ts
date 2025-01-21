import { defineComponent, renderSlot } from 'vue';
import { provideGlobalConfig } from './hooks/use-global-config';
import { configProviderDefault } from './config-provider-props';

const ConfigProvider = defineComponent({
  name: 'SyConfigProvider',
  props: {
    a11y: {
      type: Boolean,
      default: configProviderDefault.a11y,
    },
    namespace: {
      type: String,
      default: configProviderDefault.namespace,
    },
  },

  setup(props, { slots }) {
    const config = provideGlobalConfig(props);
    return () => renderSlot(slots, 'default', { config: config?.value });
  },
});
export type ConfigProviderInstance = InstanceType<typeof ConfigProvider>;

export default ConfigProvider;
