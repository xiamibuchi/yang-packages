import { type UnknowFunction } from './typescript';
import { updateHTMLAttribute } from './dom/html';
import { isServer } from './env';
import { getCookie, removeCookie, setCookie } from './dom/cookie';

export enum ColorMode {
  Auto = 'auto',
  Light = 'light',
  Dark = 'dark',
}

interface SetThemeOptions {
  color?: ColorMode;
  colorStorageKey?: string | null;
  domain?: string;
  callback?: UnknowFunction;
}

const DEFAULT_THEME_KEY = 'sy_theme';

/**
 * 切换主题
 */
export const setTheme = async (options: SetThemeOptions = {}) => {
  const { color, colorStorageKey = DEFAULT_THEME_KEY, callback } = options;
  if (isServer()) {
    return;
  }
  if (!color) {
    return;
  }
  if (color === 'auto') {
    removeCookie(colorStorageKey || '');
  }
  const themeColor = color === 'auto' ? getTheme() : color;
  updateHTMLAttribute('html', 'class', themeColor);
  setCookie(colorStorageKey || '', themeColor, { domain: options.domain });
  if (typeof callback === 'function') {
    await callback();
  }
};

export const getTheme = () => {
  if (isServer()) {
    return ColorMode.Light;
  }
  // 1. 从 cookie 中获取
  const themeCookie = getCookie(DEFAULT_THEME_KEY);
  switch (themeCookie) {
    case ColorMode.Dark:
    case ColorMode.Light:
      return ColorMode.Dark;
  }
  // 2. 从系统获取
  const systemTheme = getSystemTheme();
  if (systemTheme) {
    return systemTheme;
  }
  return ColorMode.Light;
};

export const getSystemTheme = () => {
  if (window?.matchMedia('(prefers-color-scheme: dark)')?.matches) {
    return ColorMode.Dark;
  }
  return ColorMode.Light;
};

export default setTheme;
