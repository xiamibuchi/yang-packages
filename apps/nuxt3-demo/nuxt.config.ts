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
      legacy({
        targets: [
          'chrome >= 37',
          'android >= 4.4.4',
          'iOS >= 9.3',
          'bb 7',
          'not ie < 11',
          'not ie_mob < 11',
        ],
        modernTargets: ['chrome >= 52', 'safari >= 11'],
      }),
    ],
    server: {
      fs: {
        allow: ['../../node_modules', 'node_modules'],
      },
    },
    define: {},
  },
});
