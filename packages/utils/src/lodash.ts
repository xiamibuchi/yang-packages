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
  defaultValue?: TDefault
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
