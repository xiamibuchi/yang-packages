import { isServer } from '../env';

export const updateHTMLAttribute = (
  selector: string,
  attribute: string,
  value: string,
  isSwitch?: boolean, // 属性存在时是否切换
) => {
  if (isServer()) {
    return;
  }
  if (typeof selector !== 'string') {
    return;
  }
  const el = window?.document.querySelector(selector);
  if (!el) {
    return;
  }
  if (attribute === 'class') {
    if (isSwitch && el.classList.contains(value)) {
      return el.classList.remove(value);
    }
    return el.classList.add(value);
  }

  if (isSwitch && el.getAttribute(attribute) === value) {
    return el.removeAttribute(attribute);
  }
  el.setAttribute(attribute, value);
};
