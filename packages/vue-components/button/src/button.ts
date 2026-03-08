import type { ComponentSize } from '@syseven/utils';
import type Button from './button.vue';

export interface ButtonProps {
  type?: 'default' | 'primary' | 'text';
  size?: ComponentSize;
}

export const buttonDefaults: ButtonProps = {
  type: 'default',
  size: 'medium',
};

export type ButtonInstance = InstanceType<typeof Button>;
