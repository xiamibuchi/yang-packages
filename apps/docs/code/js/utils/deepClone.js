/* eslint-disable prefer-rest-params */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-undef */
//  JSON.parse && JSON.stringify
// 性能最高，速度最快，但是只能拷贝纯json
function deepClone(obj) {
  let str,
    newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return;
  } else if (window.JSON) {
    str = JSON.stringify(obj);
    newobj = JSON.parse(str);
  } else {
    for (const i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
    }
  }
  return newobj;
}

// 递归
function deepClone(initalObj, finalObj = {}) {
  for (const i in initalObj) {
    const prop = initalObj[i];
    if (prop === finalObj) {
      continue;
    }
    if (typeof prop === 'object') {
      finalObj[i] = prop.constructor === Array ? [] : {};
      arguments.callee(prop, finalObj[i]);
    } else {
      finalObj[i] = prop;
    }
  }
  return finalObj;
}

//  Object.create()
function deepClone(initalObj, finalObj) {
  const obj = finalObj || {};
  for (const i in initalObj) {
    const prop = initalObj[i];
    if (prop === obj) {
      continue;
    }
    if (typeof prop === 'object') {
      obj[i] = prop.constructor === Array ? [] : Object.create(prop);
    } else {
      obj[i] = prop;
    }
  }
  return obj;
}

//  History API
function deepClone(obj) {
  const oldState = history.state;
  history.replaceState(obj, document.title);
  const copy = history.state;
  history.replaceState(oldState, document.title);
  return copy;
}

//MessageChannel
//异步方法，用时需注意
const obj = {};
await deepClone(obj);
function deepClone(obj) {
  return new Promise((resolve) => {
    const { port1, port2 } = new MessageChannel();
    port2.onmessage = (ev) => resolve(ev.data);
    port1.postMessage(obj);
  });
}

// lodash 中的方法
function deepClone(obj) {
  let copy;

  if (null == obj || 'object' != typeof obj) return obj;

  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  if (Array.isArray(obj)) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy;
  }

  if (obj instanceof Function) {
    copy = function () {
      return Reflect.apply(obj, this, arguments);
    };
    return copy;
  }

  if (obj instanceof Object) {
    copy = {};
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
    }
    return copy;
  }

  throw new Error(
    `Unable to copy obj as type isn't supported ${obj.constructor.name}`
  );
}
