import { get, set } from 'lodash-es';
import type { Arrayable } from '.';

// @ts-ignore
export const keysOf = <T>(arr: T) => Object.keys(arr) as Array<keyof T>;
// @ts-ignore
export const entriesOf = <T>(arr: T) => Object.entries(arr);
export { hasOwn } from '@vue/shared';

export const getProp = <T = any>(
  obj: Record<string, any>,
  path: Arrayable<string>,
  defaultValue?: any
): { value: T } => {
  return {
    get value() {
      return get(obj, path, defaultValue);
    },
    set value(val: any) {
      set(obj, path, val);
    },
  };
};
