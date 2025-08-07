# packages

base utils & components

一个基于 pnpm workspace 的 monorepo 项目，包含多个实用工具包和组件库。

## 项目结构

```
├── apps/                    # 应用目录
│   ├── docs/               # 文档应用
│   ├── mini-program/       # 小程序应用
│   └── nestjs/            # NestJS 应用
├── packages/               # 包目录
│   ├── utils/             # 工具函数包
│   ├── hooks/             # React/Vue Hooks
│   ├── components/        # 通用组件
│   ├── style/             # 样式包
│   └── ...               # 其他包
└── scripts/               # 构建脚本
```

## 环境要求

- Node.js: `>= 22.18.0`
- pnpm: `10.14.0`

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发命令

```bash
# 清理所有构建产物和 node_modules
pnpm run clean

# 运行测试
pnpm run test

# 测试覆盖率
pnpm run test:coverage

# 构建文档
pnpm run docs:build
```

### 包管理

本项目使用 pnpm workspace 进行包管理，支持：

- 依赖提升和去重
- 工作空间内包的相互引用
- 并行构建和测试

## image compress before commit

[source code](scripts/compress-image.mjs)

depend on tinypng。[doc](https://tinypng.com/developers)

> 500 per/mon limit

## 许可证

本项目采用 [MIT](LICENSE) 许可证。
