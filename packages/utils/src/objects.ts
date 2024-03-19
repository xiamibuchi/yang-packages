export { hasOwn } from '@vue/shared';

export const keysOf = <T extends object>(obj: T) =>
  Object.keys(obj) as Array<keyof T>;
