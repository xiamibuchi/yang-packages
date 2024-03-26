import type { Timer } from './types';

const isObject = (value: any) => {
  return typeof value === 'object' && value !== null;
};

/**
 * @description 深拷贝，Object 结构复杂的情况下，效率比 lodash.cloneDeep 要高
 * @see https://www.measurethat.net/Benchmarks/Show/7472/0/lodash-clonedeep-vs-json-clone-with-youtube-data
 */
export function cloneDeep(data: object) {
  if (!isObject(data)) {
    return data;
  }
  return JSON.parse(JSON.stringify(data));
}

/**
 * @description 从对象中取出指定路径的值，如果值不存在则返回默认值
 * @param value 传入对象
 * @param path 获取路径
 * @param defaultValue 默认值
 * @example
 * ```js
 *  get({ out: { inner: 3}}, 'out.inner', 4) // 3
 *  get({ out: { inner: 3}}, 'out.inner.inner') // null
 *  get({ out: { inner: 3}}, 'out.inner.inner', 4) // 4
 * ```
 */
export const get = <TDefault = unknown>(
  value: any,
  path?: string,
  defaultValue?: TDefault,
): TDefault => {
  if (defaultValue === undefined) {
    defaultValue = null as TDefault;
  }
  if (typeof path !== 'string') {
    return defaultValue;
  }
  const segments = path.split(/[.[\]]/g);
  let current: any = value;
  for (let key of segments) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    key = key.replace(/['"]/g, '');
    if (key.trim() === '') {
      continue;
    }
    current = current?.[key];
  }
  return current ?? defaultValue;
};

export const debounce = (
  func: (...params: unknown[]) => unknown,
  wait = 50,
) => {
  let timer: Timer | undefined;
  const active = true;
  const debounced = (...args: unknown[]) => {
    if (active) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        active && func(...args);
        timer = undefined;
      }, wait);
    } else {
      func(...args);
    }
  };
  return debounced;
};

export const throttle = (
  func: (...params: unknown[]) => unknown,
  wait = 50,
) => {
  let timer: Timer | undefined;
  let active = true;
  const throttled = (...args: any[]) => {
    if (!active) {
      return;
    }
    func(...args);
    active = false;
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = undefined;
      active = true;
    }, wait);
  };
  return throttled;
};

export const uniqBy = (arr: Record<string, any> | string[], keys: string[]) => {
  if (!Array.isArray(arr) || !Array.isArray(keys) || keys.length === 0) {
    throw new Error(
      'Invalid input. The first parameter should be an array, and the second parameter should be a non-empty array of keys.',
    );
  }

  if (typeof arr[0] === 'string') {
    // If the array is a string array, ensure unique values based on keys
    const uniqueValues = new Set();
    return arr.filter((item) => {
      if (uniqueValues.has(item)) {
        return false;
      }
      uniqueValues.add(item);
      return true;
    });
  } else if (typeof arr[0] === 'object') {
    // If the array is an object array, ensure unique objects based on key combinations
    const uniqueObjects = new Set();
    return arr.filter((item) => {
      const keyCombination = keys.map((key) => get(item, key)).join('|');
      if (uniqueObjects.has(keyCombination)) {
        return false;
      }
      uniqueObjects.add(keyCombination);
      return true;
    });
  } else {
    throw new TypeError(
      'Invalid input. The first parameter should be an array of strings or an array of objects.',
    );
  }
};
