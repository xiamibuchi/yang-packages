import { defineConfig } from 'vitepress'
import {
  projRoot,
} from '@syseven/build-utils'
import path from 'path';
import sidebar from './sidebar';

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
  base: '/docs/',
  title: "羊圈",
  description: "神羊的羊圈",
  favicon: "/favicon.ico",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "部署", link: "/code/deploy/github" },
      {
        text: "about me",
        link: "/about_me",
      },
    ],
    sidebar: sidebar,
    returnToTopLabel: '返回顶部',
  },
  vite: {
    resolve: {
      alias,
    },
  }
})
