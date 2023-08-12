#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const { spawnSync, execSync } = require('node:child_process');
const tinify = require('tinify');

require('dotenv').config();
// 无 key 跳过
const TINYPNG_KEY = process.env.TINYPNG_KEY;
if (!TINYPNG_KEY) {
  process.exit(0);
}
tinify.key = TINYPNG_KEY;
// 跳过 merge
const status = execSync('git status', {
  encoding: 'utf-8',
});
if (status.includes('merge')) {
  process.exit(0);
}

// ACM：Add、Copy、Modify
const message = execSync('git diff --cached --name-only --diff-filter=ACM', {
  encoding: 'utf8',
});
const files = message.split('\n').filter((file) => {
  // 过滤图片
  return /\.(png|jpg|jpeg)$/.test(file);
});

if (files.length === 0) {
  process.exit(0);
}
const tasks = [];
for (const filePath of files) {
  tasks.push(tinify.fromFile(filePath).toFile(filePath));
}
Promise.all(tasks)
  .then(() => {
    const { status } = spawnSync('git', ['add', ...files]);
    process.exit(status);
  })
  .catch(() => {
    process.exit(1);
  });
