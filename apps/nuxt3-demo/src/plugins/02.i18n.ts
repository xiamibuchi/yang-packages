import { createI18n } from 'vue-i18n';
import messageZhCN from '~/locales/zh_CN.json';

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'zh_CN',
    messages: {
      zh_CN: messageZhCN,
    },
  });

  vueApp.use(i18n);
});
