import legacy from '@vitejs/plugin-legacy';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: {
    dirs: [
      {
        path: '~/components/global',
      },
    ],
  },
  devtools: { enabled: true },
  css: ['@syseven/style/src/reset.scss'],
  imports: {
    autoImport: true,
  },
  modules: ['@pinia/nuxt'],
  srcDir: 'src/',
  vite: {
    resolve: {
      alias: [
        {
          // 处理 lodash 和 lodash-es 混用
          find: /^lodash\/(.+)?/,
          replacement: 'lodash-es/$1',
        },
      ],
    },
    build: {
      target: 'modules',
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@syseven/style/src/defination/var.scss" as *;`,
        },
      },
    },
    plugins: [
      // @ts-ignore
      legacy(),
    ],
    server: {
      fs: {
        allow: ['../../node_modules', 'node_modules'],
      },
    },
    define: {},
  },
});
