import type Text from './text.vue';

export interface textPropsType {
  expandText?: string;
  collapseText?: string;
  rows?: number;
  /**
   * @description text ellipsis label
   */
  dots?: string;
  /**
   * @description custom element tag
   */
  tag?: string;
  content?: string;
}

export const textPropsDefault: textPropsType = {
  expandText: '',
  collapseText: '',
  rows: 0,
  dots: '...',
  tag: 'span',
};

export type TextInstance = InstanceType<typeof Text>;
