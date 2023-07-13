import zhCN from './zh-CN';
import en from './en';

const defaultLocale = 'zh-CN';

const localeMap: any = {
  'zh-CN': zhCN,
  'en-US': en,
};

export const getLang = (locale: string, key: string): string => {
  if (!locale || typeof locale !== 'string') {
    locale = defaultLocale;
  }
  if (!localeMap[locale]) {
    locale = defaultLocale;
  }
  return localeMap[locale][key] || key;
};
