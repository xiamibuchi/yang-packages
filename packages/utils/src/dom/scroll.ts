import { isServer } from '../env';

export const scrollTop = (
  to: number = 0,
  element?: HTMLElement | Window,
  behavior?: ScrollBehavior,
) => {
  if (isServer()) {
    return 0;
  }
  element = element || window;
  const scrollLeft =
    element === window
      ? window.pageXOffset || document.documentElement.scrollLeft || 0
      : (element as HTMLElement).scrollLeft || 0;
  element.scrollTo({
    left: scrollLeft,
    top: to,
    behavior,
  });
  return element === window
    ? window.pageXOffset || document.documentElement.scrollLeft || 0
    : (element as HTMLElement).scrollLeft || 0;
};
