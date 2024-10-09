import { padStart } from '@syseven/utils';

export const timeTranslate = (time: number) => {
  if (!time || typeof time !== 'number') {
    time = 0;
  }
  const t = Math.round(time);
  const hours = Math.floor(t / 3600);
  const leftSeconds = t % 3600;
  const hoursString = hours ? padStart(hours) : '';
  const minutes = Math.floor(leftSeconds / 60);
  const minutesString = padStart(minutes);
  const seconds = Math.floor(leftSeconds % 60);
  const secondsString = padStart(seconds);

  return `${hours ? `${hoursString}:` : ''}${minutesString}:${secondsString}`;
};

export function createElement(tag: string, className?: string, attr?: any) {
  const el = document.createElement(tag);
  if (typeof className === 'string') {
    el.className = className;
  }
  if (attr) {
    Object.keys(attr).forEach((key) => {
      el.setAttribute(key, attr[key]);
    });
  }
  return el;
}

export function getBoundingClientRect(el: Element) {
  const elBoundingClientRect = el.getBoundingClientRect();
  elBoundingClientRect.x =
    elBoundingClientRect.x || elBoundingClientRect.left || 0;
  elBoundingClientRect.y =
    elBoundingClientRect.y || elBoundingClientRect.top || 0;
  return elBoundingClientRect;
}
