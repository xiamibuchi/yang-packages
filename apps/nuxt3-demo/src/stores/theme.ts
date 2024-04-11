import { ref } from 'vue';
import { defineStore } from 'pinia';
import { isServer } from '@syseven/utils';
import type { ColorMode } from '@syseven/utils';
import { useHeadSafe } from '#imports';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'auto' | 'light' | 'dark'>('auto');
  const setTheme = async (theme: ColorMode) => {
    console.log(theme);
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
  return {
    theme,
    setTheme,
  };
});
