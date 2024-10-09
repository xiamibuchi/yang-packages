import { type UnknowFunction } from '@syseven/utils';

function isArrowFunction(fn: UnknowFunction) {
  return fn.prototype === undefined;
}

/**
 * 模拟 new 操作符
 */
export function _new(fn: UnknowFunction, ...args: any[]) {
  if (typeof fn !== 'function' || isArrowFunction(fn)) {
    throw TypeError('not a constructor');
  }

  const obj: any = {};
  obj.__proto__ = fn.prototype;
  const result = fn.apply(obj, args);
  return result instanceof Object ? result : obj;
}
