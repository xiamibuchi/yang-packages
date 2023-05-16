import { defineConfig } from 'vitepress'
import {
  projRoot,
} from '@syseven/build-utils'
import path from 'path';
import VueMacros from 'unplugin-vue-macros/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';

import type { Alias } from 'vite'

const alias: Alias[] = [
  {
    find: '~/',
    replacement: `${path.resolve(__dirname, './.vitepress/vitepress')}/`,
  },
]

if (process.env.DOC_ENV !== 'production') {
  alias.push(
    {
      find: /^@syseven\/xiami(\/(es|lib))?$/,
      replacement: path.resolve(projRoot, 'packages/xiami/index.ts'),
    },
    {
      find: /^@syseven\/xiami\/(es|lib)\/(.*)$/,
      replacement: `${path.resolve(projRoot, 'packages')}/$2`,
    }
  )
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "xiami components doc",
  description: "xiami components doc",
  vite: {
    resolve: {
      alias,
    },
    plugins: [
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vueJsx: vueJsx(),
        },
      }),
    ],
  }
})
