import { padStart } from './string';

export const hex2rgba = (hex: string, alpha: number = 1) => {
  if (!/^#([0-9a-fA-F]{3}){1,2}$/.test(hex)) {
    throw new Error('Invalid hex color');
  }
  if (hex.length === 4) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export const rgb2hex = (rgb: string) => {
  const [r, g, b] = rgb.match(/\d+/g)!.map((x) => parseInt(x).toString(16));
  return `#${padStart(r)}${padStart(g)}${padStart(b)}`;
};
