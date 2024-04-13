import { ref } from 'vue';
import { defineStore } from 'pinia';
import { isServer } from '@syseven/utils';
import { type ColorMode, getTheme, setTheme } from '@syseven/utils';
import { useHeadSafe } from '#imports';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'auto' | 'light' | 'dark'>('auto');
  const setTheme = async (theme: ColorMode) => {
    setTheme(theme);
    if (!isServer()) {
      useHeadSafe({
        meta: [
          {
            name: 'theme-color',
            content: 'red',
          },
        ],
      });
    }
  };
  const initTheme = () => {
    if (isServer()) {
      return;
    }
    theme.value = getTheme();
  };
  return {
    theme,
    setTheme,
    initTheme,
  };
});
