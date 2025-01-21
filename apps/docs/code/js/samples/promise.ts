enum PromiseStatus {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

export class _Promise {
  status: PromiseStatus;
  value: any;
  reason: any;
  onFulfilledCallbacks: any[];
  onRejectedCallbacks: any[];
  constructor(executor) {
    // 状态
    this.status = PromiseStatus.PENDING;
    // 值
    this.value = '';
    // 原因
    this.reason = '';
    // 成功状态的回调函数数组
    this.onFulfilledCallbacks = [];
    // 失败状态的回调函数数组
    this.onRejectedCallbacks = [];
    if (typeof executor !== 'function') {
      throw TypeError('executor 必须是函数');
    }

    const resolve = (value) => {
      if (this.status === PromiseStatus.PENDING) {
        this.status = PromiseStatus.FULFILLED;
        this.value = value;
        for (const fn of this.onFulfilledCallbacks) {
          typeof fn === 'function' && fn();
        }
      }
    };

    const reject = (reason) => {
      if (this.status === PromiseStatus.PENDING) {
        this.status = PromiseStatus.REJECTED;
        this.reason = reason;
        for (const fn of this.onRejectedCallbacks) {
          typeof fn === 'function' && fn();
        }
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    // 如果 onFulfilled 是函数，则直接使用，否则默认为返回值不变的函数
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    // 如果 onRejected 是函数，则直接使用，否则默认为抛出异常的函数
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise2 = new _Promise((resolve, reject) => {
      if (this.status == PromiseStatus.FULFILLED) {
        try {
          // 如果当前状态为 resolved，则调用 onFulfilled 函数处理值
          const x = onFulfilled(this.value);
          resolve(x);
        } catch (error) {
          // 如果 onFulfilled 函数抛出异常，则调用 reject 函数
          reject(error);
        }
      }
      if (this.status == 'rejected') {
        try {
          // 如果当前状态为 rejected，则调用 onRejected 函数处理原因
          const x = onRejected(this.reason);
          resolve(x);
        } catch (error) {
          // 如果 onRejected 函数抛出异常，则调用 reject 函数
          reject(error);
        }
      }
      if (this.status == 'pending') {
        // 如果当前状态为 pending，则将回调函数添加到对应的数组中
        this.onFulfilledCallbacks.push(() => {
          if (this.status == PromiseStatus.FULFILLED) {
            try {
              // 如果当前状态变为 resolved，则调用 onFulfilled 函数处理值
              const x = onFulfilled(this.value);
              resolve(x);
            } catch (error) {
              // 如果 onFulfilled 函数抛出异常，则调用 reject 函数
              reject(error);
            }
          }
        });
        this.onRejectedCallbacks.push(() => {
          if (this.status == 'rejected') {
            try {
              // 如果当前状态变为 rejected，则调用 onRejected 函数处理原因
              const x = onRejected(this.reason);
              resolve(x);
            } catch (error) {
              // 如果 onRejected 函数抛出异常，则调用 reject 函数
              reject(error);
            }
          }
        });
      } else {
        // 执行完所有回调函数之后，清空回调数组
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
      }
    });
    // 返回新的Promise对象
    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(value) {
    if (value instanceof _Promise) {
      return value;
    }
    return new _Promise((resolve) => {
      resolve(value);
    });
  }

  finally(onFinally) {
    return this.then(
      (value) =>
        _Promise.resolve(onFinally()).then(
          () => value,
          //这个reason为onFinally 显示指定一个 rejected的promise而产生，并传递下去
          (newReason) => {
            throw newReason;
          },
        ),
      (reason) =>
        _Promise.resolve(onFinally()).then(
          () => {
            throw reason;
          },
          (newReason) => {
            throw newReason;
          },
        ),
    );
  }

  static reject(reason) {
    return new _Promise((resolve, reject) => {
      reject(reason);
    });
  }

  /**
   * 将多个Promise对象合并为一个新的Promise对象
   * @param {Array} promises - 包含多个Promise对象的数组
   * @returns {_Promise} - 合并后的Promise对象
   */
  static all(promises) {
    return new _Promise((resolve, reject) => {
      let resolvedCount = 0;
      const values = new Array(promises.length);
      for (let i = 0; i < promises.length; i++) {
        if (!_Promise.isPromise(promises[i])) {
          reject(new TypeError('Expected a Promise'));
          break;
        }

        // 处理每个Promise
        promises[i].then(
          (value) => {
            resolvedCount++;
            values[i] = value;

            // 当所有Promise都成功时，resolve结果数组
            if (resolvedCount === promises.length) {
              resolve(values);
            }
          },
          (reason) => {
            // 只要有一个Promise失败，就reject整个Promise.all的结果
            reject(reason);
          },
        );
      }
    });
  }

  /**
   * 判断是否为Promise对象
   * @param {*} value - 待判断的对象
   * @returns {boolean} - 是否为Promise对象
   */
  static isPromise(value) {
    return (
      value instanceof _Promise ||
      (typeof value === 'object' &&
        value !== null &&
        typeof value.then === 'function')
    );
  }

  /**
   * 执行一组Promise中的第一个完成（resolve或reject）的Promise
   * @param {Array} promises - Promise对象数组
   * @returns {_Promise} - 新的Promise实例
   */
  static race(promises) {
    return new _Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        if (!_Promise.isPromise(promises[i])) {
          reject(new TypeError('Expected a Promise'));
          break;
        }
        // 当任何一个Promise resolve或reject时，立即结束新Promise的状态
        promises[i].then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          },
        );
      }
    });
  }
}
