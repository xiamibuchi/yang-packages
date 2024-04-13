import { useThemeStore } from '~/stores/theme';

export default defineNuxtPlugin({
  name: 'init',
  enforce: 'post',
  async setup() {},
  hooks: {
    'app:created': () => {
      const themeStore = useThemeStore();
      themeStore.initTheme();
    },
  },
});
