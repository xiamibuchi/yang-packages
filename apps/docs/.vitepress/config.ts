import { defineConfig } from 'vitepress'
import sidebar from './sidebar';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/yang-packages/',
  title: "羊圈",
  description: "神羊的羊圈",
  outDir: "../../dist",
  head: [
    ["link", { rel: "shortcut icon", type: 'image/svg+xml', href: "/logo.svg" }],
    ["meta", { name: "author", content: "xiamibuchi" }],
    ["meta", { name: "keywords", content: "syseven, 神羊, 沈阳, 羊圈, xiamibuchi" }],
    ["meta", { name: "description", content: "神羊的羊圈" }],
    ["meta", { name: "viewport", content: "width=device-width,initial-scale=1,user-scalable=no" }],
    ["meta", { name: "theme-color", content: "#ffffff" }],
    ["meta", { name: "msapplication-TileColor", content: "#ffffff" }],
    ["meta", { name: "msapplication-TileImage", content: "/logo.png" }],
    ["meta", { name: "msapplication-config", content: "/logo.png" }],
    ["meta", { name: "apple-mobile-web-app-title", content: "羊圈" }],
    ["meta", { name: "application-name", content: "羊圈" }],
    ["meta", { name: "msapplication-tooltip", content: "羊圈" }],
    ["meta", { name: "msapplication-starturl", content: "/" }],
    ["meta", { name: "msapplication-navbutton-color", content: "#ffffff" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }],
    ["meta", { name: "renderer", content: "webkit" }],
    ["meta", { name: "X-UA-Compatible", content: "IE=edge,chrome=1" }],
    // ["meta", { name: "baidu-site-verification", content: "code-4QZQZQZQZQ" }],
    // ["meta", { name: "google-site-verification", content: "code-4QZQZQZQZQ" }],
  ],
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
    server: {
      port: 3333,
    },
    resolve: {},
  }
})
