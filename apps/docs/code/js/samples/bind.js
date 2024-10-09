Function.prototype._call = function (thisArg, ...args) {
  const context = Object(thisArg) || window;
  const key = Symbol();
  context[key] = this;
  const res = context[key](...args);
  delete context[key];
  return res;
};

Function.prototype._apply = function (thisArg, args) {
  const context = Object(thisArg) || window;
  const key = Symbol();
  context[key] = this;
  const res = context[key](args);
  delete context[key];
  return res;
};

Function.prototype._bind = function (thisArg, ...args) {
  const key = Symbol();
  thisArg[key] = this;
  return function (...args1) {
    const allArgs = [...args, ...args1];
    return thisArg[key].call(thisArg, allArgs);
  };
};
