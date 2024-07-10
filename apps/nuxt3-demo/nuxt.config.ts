import legacy from 'vite-plugin-legacy-swc';

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
  css: ['@syseven/style/src/reset.scss', '@syseven/style/src/base.scss'],
  imports: {
    autoImport: true,
  },
  modules: ['@pinia/nuxt'],
  srcDir: 'src/',
  devServer: {
    host: '0.0.0.0',
  },
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
