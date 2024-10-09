import { type ComponentSize } from '@syseven/utils';
import type Button from './button.vue';

export interface buttonPropsType {
  type?: 'default' | 'primary' | 'text';
  size?: ComponentSize;
}

export const buttonPropsDefault: buttonPropsType = {
  type: 'default',
  size: 'medium',
};

export type ButtonInstance = InstanceType<typeof Button>;
