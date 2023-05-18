---
title: Github Actions 部署页面
editLink: true
---

# Github Actions 部署页面

Github 可以现在也可以通过 Github Actions 部署页面。

[具体直接看这篇教程即可](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)

相较于之前用的 [jenkins](/code/deploy/docker-jenkins) 方案，Github Actions 的方案更方便，配置上也更清晰。

```yml
name: Deploy
on:
  workflow_dispatch: {}
  push:
    branches:
      - master
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - uses: pnpm/action-setup@v2
        with:
          # Version of pnpm to install
          version: 7.29.0
          # Where to store pnpm files
          dest: ~/setup-pnpm
          # If specified, run `pnpm install`
          run_install: false
      - uses: actions/cache@v3
        name: Setup pnpm cache
        with:
          path: ~/setup-pnpm
          key: pnpm-lock.yaml
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Build
        run: pnpm run docs:build
      - uses: actions/configure-pages@v2
      - uses: actions/upload-pages-artifact@v1
        with:
          path: docs/.vitepress/dist
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v1
```
