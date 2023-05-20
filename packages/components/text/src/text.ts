import { buildProps } from '@syseven/utils';
import type { ExtractPropTypes } from 'vue';
import type Text from './text.vue';

export const textProps = buildProps({
  expandText: {
    type: String,
    default: '',
  },
  collapseText: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 0,
  },
  /**
   * @description text ellipsis label
   */
  dots: {
    type: String,
    default: '...',
  },
  /**
   * @description custom element tag
   */
  tag: {
    type: String,
    default: 'span',
  },
} as const);

export type TextProps = ExtractPropTypes<typeof textProps>;
export type TextInstance = InstanceType<typeof Text>;
