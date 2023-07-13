import { MimetypesKind } from './constants';

const formatNumber = (num: number) => {
  return num < 10 ? `0${num}` : `${num}`;
};

export const timeTranslate = (time: number) => {
  if (!time || typeof time !== 'number') {
    time = 0;
  }
  const t = Math.round(time);
  const hours = Math.floor(t / 3600);
  const leftSeconds = t % 3600;
  const hoursString = hours ? formatNumber(hours) : '';
  const minutes = Math.floor(leftSeconds / 60);
  const minutesString = formatNumber(minutes);
  const seconds = Math.floor(leftSeconds % 60);
  const secondsString = formatNumber(seconds);

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

export const getMimetype = (url: string) => {
  if (!url || typeof url !== 'string') {
    return '';
  }
  const ext = url.split('.').pop()?.toLocaleLowerCase() || '';
  const mediaType = MimetypesKind[ext] || ext;
  return mediaType;
};
