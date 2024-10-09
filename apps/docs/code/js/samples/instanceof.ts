export const _instanceof = (left, right) => {
  while (left !== null) {
    if (left.__proto__ === right.prototype) {
      return true;
    }
    left = left.__proto__;
  }

  return false;
};

export const _instanceof2 = (left, right) => {
  return right.prototype.isPrototypeOf!(left);
};
