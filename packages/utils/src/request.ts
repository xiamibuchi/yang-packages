import { isServer } from './env';
import type { UnknowFunction } from './typescript';

export const toFormData = (data: any) => {
  const formData = isServer() ? new URLSearchParams() : new FormData();
  for (const key of Object.keys(data)) {
    const value = data[key];
    if (value === null || value === undefined) {
      continue;
    }
    if (typeof value === 'object' && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  }
  return formData;
};

export function getXff(xff: string, remoteAddress?: string) {
  if (!remoteAddress) {
    return xff;
  }
  const xffList = xff.split(',').map((x) => x.trim());
  xffList.push(remoteAddress);
  return xffList.join(', ');
}

export class RequestQueue {
  limit: number;
  current: number;
  queue: UnknowFunction[];
  constructor(config?: { limit?: number }) {
    this.limit = config?.limit || 6;
    this.current = 0;
    this.queue = [];
  }
  add(fn: UnknowFunction) {
    this.queue.push(fn);
    this.next();
  }
  // 内部方法
  async _run(fn: UnknowFunction, callback: () => void) {
    try {
      await fn();
    } catch (e) {
      console.error(e);
    }
    callback();
  }
  next() {
    while (this.current < this.queue.length && this.queue.length > 0) {
      const fn = this.queue.shift()!;
      this.current++;
      this._run(fn, () => {
        this.current--;
        this.next();
      });
    }
  }
}
