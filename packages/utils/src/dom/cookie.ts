import { isServer } from '../env';

interface CookieAttributes {
  expires?: number | Date | undefined;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  [key: string]: any;
}

const DEFAULT_ATTRIBUTES: CookieAttributes = {
  path: '/',
};

const read = (value: string) => {
  if (value[0] === '"') {
    value = value.slice(1, -1);
  }
  return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
};
const write = (value: string) => {
  return encodeURIComponent(value).replace(
    /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
    decodeURIComponent,
  );
};

export const setCookie = (
  name: string,
  value: string,
  attributes: CookieAttributes = {},
) => {
  if (isServer()) {
    return;
  }
  const _attributes: Omit<CookieAttributes, 'expires'> = {
    ...DEFAULT_ATTRIBUTES,
    ...attributes,
  };
  if (attributes?.expires) {
    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    _attributes.expires = attributes.expires.toUTCString();
  }
  name = encodeURIComponent(name)
    .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
    .replace(/[()]/g, encodeURIComponent);

  let stringifiedAttributes = '';
  for (const attributeName in attributes) {
    if (!attributes[attributeName]) {
      continue;
    }
    stringifiedAttributes += `; ${attributeName}`;

    if (attributes[attributeName] === true) {
      continue;
    }
    stringifiedAttributes += `=${attributes[attributeName].split(';')[0]}`;
  }
  return (document.cookie = `${name}=${write(value)}${stringifiedAttributes}`);
};

export const getCookie = (name: string) => {
  if (isServer()) {
    return;
  }
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const jar: Record<string, string | undefined> = {};
  for (let i = 0; i < cookies.length; i++) {
    const parts = cookies[i].split('=');
    const value = parts.slice(1).join('=');
    try {
      const found = decodeURIComponent(parts[0]);
      if (!(found in jar)) {
        jar[found] = read(value);
      }
      if (name === found) {
        break;
      }
    } catch {}
  }
  return name ? jar[name] : jar;
};

export const removeCookie = (
  name: string,
  attributes: CookieAttributes = {},
) => {
  setCookie(name, '', { ...attributes, expires: -1 });
};
