import type { ExtractPropTypes } from 'vue';
import type Text from './text.vue';

export const textProps = {
  /**
   * @description custom element tag
   */
  tag: {
    type: String,
    default: 'span',
  },
} as const;

export type TextProps = ExtractPropTypes<typeof textProps>;
export type TextInstance = InstanceType<typeof Text>;
