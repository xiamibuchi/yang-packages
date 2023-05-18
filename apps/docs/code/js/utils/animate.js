function animate(element, target, num = 10, spd = 15, fn) {
  clearInterval(element.timer);
  element.timer = setInterval(() => {
    //让盒子每次在原来的基础上移动 num px
    let left = element.offsetLeft;
    const step = target > left ? num : -num;

    //只有当距离超过step的时候，才运行，否则，清除定时器
    if (Math.abs(left - target) >= Math.abs(step)) {
      left += step;
      element.style.left = `${left}px`;
    } else {
      clearInterval(element.timer);
      element.style.left = `${target}px`;
      fn && fn();
    }
  }, 15);
}

function animate2(element, target) {
  clearInterval(element.timer);
  element.timer = setInterval(() => {
    let left = element.offsetLeft;
    //缓速的原理：在原来的基础上每次跑step的距离， step的值在一直变小
    let step = (target - left) / 10;
    //保证step最少都是1px,向上取整
    step = step > 0 ? Math.ceil(step) : Math.floor(step);
    left += step;
    element.style.left = `${left}px`;
    if (left == target) {
      clearInterval(element.timer);
    }
  }, 15);
}
