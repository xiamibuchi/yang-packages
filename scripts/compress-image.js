#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const { spawnSync, execSync } = require('node:child_process');
const { readFileSync, writeFileSync } = require('node:fs');
const tinify = require('tinify');
const { optimize } = require('svgo');

require('dotenv').config();

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
const files = message.split('\n');

const svgs = files.filter((file) => {
  return /\.svg$/.test(file);
});

if (svgs.length > 0) {
  for (const svgPath of svgs) {
    const content = readFileSync(svgPath, 'utf-8');
    try {
      const { data } = optimize(content, {
        path: svgPath,
        multipass: true,
      });
      writeFileSync(svgPath, data, {
        encoding: 'utf-8',
      });
    } catch (_) {
      process.exit(1);
    }
  }
  const { status } = spawnSync('git', ['add', ...svgs]);
  process.exit(status);
}

// 无 key 跳过
const TINYPNG_KEY = process.env.TINYPNG_KEY;
if (!TINYPNG_KEY) {
  process.exit(0);
}
tinify.key = TINYPNG_KEY;

const images = files.filter((file) => {
  return /\.(png|jpg|jpeg)$/.test(file);
});

if (images.length > 0) {
  const tasks = [];
  for (const filePath of files) {
    tasks.push(tinify.fromFile(filePath).toFile(filePath));
  }
  Promise.all(tasks)
    .then(() => {
      const { status } = spawnSync('git', ['add', ...images]);
      process.exit(status);
    })
    .catch(() => {
      process.exit(1);
    });
}
