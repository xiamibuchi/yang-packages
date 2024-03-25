import { buildProps } from '@syseven/utils';
import type { ExtractPropTypes } from 'vue';

export type ExperimentalFeatures = {
  // TO BE Defined
};

export const configProviderProps = buildProps({
  /**
   * @description Controlling if the users want a11y features
   */
  a11y: {
    type: Boolean,
    default: true,
  },
  namespace: {
    type: String,
    default: 'sy',
  },
} as const);
export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>;
