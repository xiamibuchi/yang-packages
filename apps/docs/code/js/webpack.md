# webpack

- [github](https://github.com/webpack/webpack)

1. webpack 将带有依赖项的各个模块打包处理后，变成了独立的浏览器能够识别的文件
2. webpack 合并以及解析带有依赖项的模块

## 概述

Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
Plugin：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情

## Symlinks

webpack 的 loader 没办法处理软连接，所以传参的路径都要用 fs.realpathSync 处理成绝对连接

```js
config = {
  include: path.resolve(__dirname, 'src'),
};
// 改为

config = {
  include: fs.realpathSync(path.resolve(__dirname, 'src')),
};
```

### webpack 与模块

- [前端模块系统的演进](http://zhaoda.net/webpack-handbook/module-system.html)
- 在 webpack 看来：所有的**静态资源都是模块**
- webpack 模块能够识别以下等形式的模块之间的依赖：
- JS 的模块化规范：
  - ES2015 `import` `export`
  - CommonJS `require()` `module.exports`
  - AMD `define` 和 `require`
- 非 JS 等静态资源：
  - css/sass/less 文件中的 `@import`
  - 图片连接，比如：样式 `url(...)` 或 HTML `<img src=...>`
  - 字体 等

### webpack 文档和资源

## 常用插件

### webpack-dev-server

- 作用：配合 webpack，创建开发环境（启动服务器、监视文件变化、自动编译、刷新浏览器等），提高开发效率
- 注意：`webpack-dev-server`将打包好的文件存储在内存中，提高编译和加载速度，效率更高
- 注意：输出的文件被放到项目根目录中
  - 命令行中的提示：`webpack output is served from /`
  - 在`index.html`页面中直接通过 `/bundle.js` 来引入内存中的文件

### html-webpack-plugin

- 作用：根据模板，自动生成 html 页面

# VUE

## Loaders（加载器）

- [webpack - Loaders](https://webpack.js.org/loaders/)
- [webpack - 管理资源示例](https://doc.webpack-china.org/guides/asset-management)

> webpack enables use of loaders to preprocess files. This allows you to bundle any static resource way beyond JavaScript.

- webpack 只能处理 JavaScript 资源
- webpack 通过 loaders 处理非 JavaScript 静态资源

## CSS 打包

- 1 CSS 打包文件（加载）
- 2 SASS 打包文件（编译为 CSS）

### 使用 webpack 打包 CSS

- 安装：`npm i -D style-loader css-loader`
- 注意：use 中模块的顺序不能颠倒，加载顺序：从右向左加载

```js
/* index.js */

// 导入 css 文件
import './css/app.css';

/* webpack.config.js */

// 配置各种资源文件的loader加载器
const module = {
  // 配置匹配规则
  rules: [
    // test 用来配置匹配文件规则（正则）
    // use  是一个数组，按照从后往前的顺序执行加载
    { test: /\.css$/, use: ['style-loader', 'css-loader'] },
  ],
};
```

### 使用 webpack 打包 sass 文件

- 安装：`npm i -D sass-loader node-sass`
- 注意：`sass-loader` 依赖于 `node-sass` 模块

```js
/* webpack.config.js */

// 参考：https://webpack.js.org/loaders/sass-loader/#examples
// "style-loader"  ：creates style nodes from JS strings 创建style标签
// "css-loader"    ：translates CSS into CommonJS 将css转化为CommonJS代码
// "sass-loader"   ：compiles Sass to CSS 将Sass编译为css

const module = {
  rules: [
    {
      test: /\.(scss|sass)$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
  ],
};
```

## 图片和字体打包

- 安装：`npm i -D url-loader file-loader`
- `file-loader`：加载并重命名文件（图片、字体 等）
- `url-loader`：将图片或字体转化为 base64 编码格式的字符串，嵌入到样式文件中

```js
/* webpack.config.js */

const module = {
  rules: [
    // 打包 图片文件
    { test: /\.(jpg|png|gif|jpeg)$/, use: 'url-loader' },

    // 打包 字体文件
    { test: /\.(woff|woff2|eot|ttf|otf)$/, use: 'file-loader' },
  ],
};
```

### 图片打包细节

- `limit`参数的作用：（单位为：字节(byte)）
  - 当图片文件大小（字节）`小于`指定的 limit 时，图片被转化为 base64 编码格式
  - 当图片文件大小（字节）`大于等于`指定的 limit 时，图片被重命名以 url 路径形式加载（此时，需要`file-loader`来加载图片）
- 图片文件重命名，保证相同文件不会被加载多次。例如：一张图片（a.jpg）拷贝一个副本（b.jpg），同时引入这两张图片，重命名后只会加载一次，因为这两张图片就是同一张
- 文件重命名以后，会通过 MD5 加密的方式，来计算这个文件的名称

```js
/* webpack.config.js */

const module = {
  rules: [
    // {test: /\.(jpg|png|gif|jpeg)$/, use: 'url-loader?limit=100'},
    {
      test: /\.(jpg|png|gif|jpeg)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
          },
        },
      ],
    },
  ],
};
```

### 字体文件打包说明

- 处理方式与图片相同，可以使用：`file-loader`或`url-loader`

## Babel

Babel 是一个编译 JavaScript 的平台，它可以编译代码帮你达到以下目的：

- 让你能使用最新的 JavaScript 代码（ES6，ES7...），而不用管新标准是否被当前使用的浏览器完全支持；
- 让你能使用基于 JavaScript 进行了拓展的语言，比如 React 的 JSX；

* [babel](https://babeljs.io/)
* [es2015-loose](http://2ality.com/2015/12/babel6-loose-mode.html)
* [babel 全家桶](https://github.com/brunoyang/blog/issues/20)
* 安装：`npm i -D babel-core babel-loader`
* 安装：`npm i -D babel-preset-env`

### 基本使用（两步）

- 第一步：

```js
/* webpack.config.js */

const module = {
  rules: [
    // exclude 排除，不需要编译的目录，提高编译速度
    { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
  ],
};
```

- 第二步：在项目根目录中新建`.babelrc`配置文件

```json
/* .babelrc */

// 将来babel-loader运行的时候，会检查这个配置文件，并读取相关的语法和插件配置
{
  "presets": ["env"]
}
```

## babel 的说明

- babel 的作用：
  - 1 语法转换：将新的 ES 语法转化为浏览器能识别的语法（babel-preset-\*）
  - 2 polyfill 浏览器兼容：让低版本浏览器兼容最新版 ES 的 API

### babel-preset-\*

> Babel 通过语法转换器，能够支持最新版本的 JavaScript 语法  
> babel-preset-\* 用来指定我们书写的是什么版本的 JS 代码

- 作用：将新的 ES 语法转化为浏览器能识别的 ES5 代码
- [ES6 语法提案的批准流程](http://es6.ruanyifeng.com/#docs/intro#语法提案的批准流程)
  - ES2015 也就是 ES6, 下一个版本是 ES7, 从 ES6 到 ES7 之间经历了 5 个阶段
  - babel-preset-es2015 转换 es6 的语法
  - babel-preset-stage-0 转换比 es6 更新的语法

```html
Stage 0 - Strawman（展示阶段） Stage 1 - Proposal（征求意见阶段） Stage 2 -
Draft（草案阶段） Stage 3 - Candidate（候选人阶段） Stage 4 -
Finished（定案阶段） Stage 0 is "i've got a crazy idea", stage 1 is "this idea
might not be stupid", stage 2 is "let's use polyfills and transpilers to play
with it", stage 3 is "let's let browsers implement it and see how it goes",
stage 4 is "now it's javascript".
```

### babel-polyfill 和 transform-runtime

- 作用：实现浏览器对不支持 API 的兼容（兼容旧环境、填补）
  - 在低版本浏览器中使用高级的 ES6 或 ES7 的方法或函数，比如：`'abc'.padStart(10)`
- [方式一 polyfill](https://babeljs.io/docs/usage/polyfill/#usage-in-node-browserify-webpack)
- [方式二 transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/)
- 方式一：`npm i -S babel-polyfill`
- 方式二：`npm i -D babel-plugin-transform-runtime` 和 `npm i -S babel-runtime`
  - 注意：babel-runtime 包中的代码会被打包到你的代码中（-S）

```
区别： polyfill
所有兼容性问题，都可以通过polyfill解决（包括：实例方法）、污染全局环境 runtime
除了实例方法以外，其他兼容新问题都能解决、不污染全局环境
polyfill：如果想要支持全局对象（比如：`Promise`）、静态方法（比如：`Object.assign`）或者**实例方法**（比如：`String.prototype.padStart`）等，那么就需要使用`babel-polyfill`
babel-runtime ：提供了兼容旧环境的函数，使用的时候，需要我们自己手动引入 比如：
const Promise = require('babel-runtime/core-js/promise') 存在的问题： 1
手动引入太繁琐 2 多个文件引入同一个helper（定义），造成代码重复，增加代码体积
babel-plugin-transform-runtime： 1 自动引入helper（比如，上面引入的 Promise） 2
babel-runtime提供helper定义，引入这个helper即可使用，避免重复 3 依赖于
babel-runtime 插件 transform-runtime插件的使用： 直接在 .bablerc
文件中，添加一个 plugins 的配置项即可！！！ "plugins": [ "transform-runtime" ]
```

```js
/*
  babel-polyfill 的使用步骤：
  1 main.js
*/
// 第一行引入
require('babel-polyfill');

const s = 'abc'.padStart(4);
console.log(s);

// 2 webpack.config.js 配置
module.exports = {
  entry: ['babel-polyfill', './js/main.js'],
};
```

### 总结

```html
babel-core babel核心包 babel-loader 用来解析js文件 babel-preset-*
新ES语法的解析和转换 transform-runtime / babel-polyfill
兼容旧浏览器，到达支持新API目的 // 判断浏览器是否兼容 padStart 这个 API if
(!String.prototype.padStart) { // 如果不兼容, 就自己模拟 padStart的功能实现一份
String.prototype.padStart = function padStart(targetLength,padString) { } }
```

## vue 单文件组件

- [vue-loader](https://vue-loader.vuejs.org/zh-cn/)
- single-file components(单文件组件)
- 后缀名：`.vue`，该文件需要被预编译后才能在浏览器中使用
- 注意：单文件组件依赖于两个包 **vue-loader** / **vue-template-compiler**
- 安装：`npm i -D vue-loader vue-template-compiler`

```html
<!-- App.vue 示例代码： -->
<template>
  <div>
    <h1>VUE 单文件组件示例 -- App.vue</h1>
    <p>这是 模板内容</p>
  </div>
</template>

<script>
  // 组件中的逻辑代码
  export default {};
</script>

<style>
  /* 组件样式 */
  h1 {
    color: red;
  }
</style>
```

```js
// webpack.config.js 配置：
const module = {
  rules: [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
    },
  ],
};
```

### 使用单文件组件

```js
/* main.js */

import Vue from 'vue';
// 导入 App 组件
import App from './App.vue';

const vm = new Vue({
  el: '#app',
  // 通过 render 方法，渲染App组件
  render: (c) => c(App),
});
```

### 单文件组件使用步骤

- 1 安装：`npm i -D vue-loader vue-template-compiler`
- 2 在 `webpack.config.js` 中配置 `.vue` 文件的 loader
  - `{ test: /\.vue$/, use: 'vue-loader' }`
- 3 创建 `App.vue` 单文件组件，注意：App 可以是任意名称
- 4 在 `main.js` 入口文件中，导入 `vue` 和 `App.vue`组件，通过 render 将组件与实例挂到一起

### 单文件组件+路由

- [vue - Vue.use](https://cn.vuejs.org/v2/api/#Vue-use)
- [Vue.use 和 路由](https://cn.vuejs.org/v2/guide/plugins.html#使用插件)

```js
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

// ------------- vue路由配置 开始 --------------
import Home from './components/home/Home.vue';
import Login from './components/login/Login.vue';

// 1 导入 路由模块
// 2 ** 调用use方法使用插件 **
Vue.use(VueRouter);
// 3 创建路由对象
const router = new VueRouter({
  routes: [
    { path: '/home', component: Home },
    { path: '/login', component: Login },
  ],
});

// ------------- vue路由配置 结束 --------------

const vm = new Vue({
  el: '#app',
  render: (c) => c(App),
  // 4 挂载到 vue 实例中
  router,
});
```

## 错误处理

### 下载源连接错误

```
npm set registry https://registry.npmjs.org/
rm -rf node_modules/
npm cache clean --force
npm cache verify
npm install
```

## splitChunk

```js
const optimization = {
  splitChunks: {
    chunks: 'async', // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
    minSize: 30000, // 最小尺寸，30000
    minChunks: 1, // 最小 chunk ，默认1
    maxAsyncRequests: 5, // 最大异步请求数， 默认5
    maxInitialRequests: 3, // 最大初始化请求书，默认3
    automaticNameDelimiter: '~', // 打包分隔符
    name, // 打包后的名称，此选项可接收 function
    cacheGroups: {
      // 这里开始设置缓存的 chunks
      priority: 0, // 缓存组优先级
      vendor: {
        // key 为entry中定义的 入口名称
        chunks: 'initial', // 必须三选一： "initial" | "all" | "async"(默认就是async)
        test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
        name: 'vendor', // 要缓存的 分隔出来的 chunk 名称
        minSize: 30000,
        minChunks: 1,
        enforce: true,
        maxAsyncRequests: 5, // 最大异步请求数， 默认1
        maxInitialRequests: 3, // 最大初始化请求书，默认1
        reuseExistingChunk: true, // 可设置是否重用该chunk
      },
    },
  },
};
```

## plugin

[compiler 钩子](https://www.webpackjs.com/api/compiler-hooks/)

插件组成：

- 一个 JavaScript 函数或者类
- 在函数原型（prototype）中定义一个注入 compiler 对象的 apply 方法。
- apply 函数中通过 compiler 插入指定的事件钩子，在钩子回调中拿到 compilation 对象
- 使用 compilation 操纵修改 webapack 内部实例数据。
- 异步插件，数据处理完后使用 callback 回调

- Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，hook，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例
- Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。

```js
// 获取output路径，也就是出口路径一般为dist
// 绑定钩子事件 compiler.plugin('done', (stats) => {})
// 编译文件，与原来文件对比，删除未匹配文件 （同时可以 options 设置要忽略的文件）
const path = require('path');
const fs = require('fs');
const recursiveReadSync = require('recursive-readdir-sync');
const minimatch = require('minimatch');
const union = require('lodash.union');

// 匹配文件
function getFiles(fromPath, exclude = []) {
  const files = recursiveReadSync(fromPath).filter((file) =>
    exclude.every(
      (excluded) =>
        !minimatch(path.relative(fromPath, file), path.join(excluded), {
          dot: true,
        })
    )
  );
  // console.log(files);
  return files;
}

class WebpackCleanupPlugin {
  constructor(options = {}) {
    // 配置文件
    this.options = options;
  }
  apply(compiler) {
    // 获取output路径
    const outputPath = compiler.options.output.path;
    // 绑定钩子事件
    compiler.plugin('done', (stats) => {
      if (
        compiler.outputFileSystem.constructor.name !== 'NodeOutputFileSystem'
      ) {
        return;
      }
      // 获取编译完成 文件名
      const assets = stats.toJson().assets.map((asset) => asset.name);
      console.log(assets);
      // 多数组合并并且去重
      const exclude = union(this.options.exclude, assets);
      console.log(exclude);
      // console.log('outputPath', outputPath);
      // 获取未匹配文件
      const files = getFiles(outputPath, exclude);
      // const files = [];
      console.log('files', files);
      if (this.options.preview) {
        // console.log('%s file(s) would be deleted:', files.length);
        // 输出文件
        files.forEach((file) => console.log('    %s', file));
        // console.log();
      } else {
        // 删除未匹配文件
        files.forEach(fs.unlinkSync);
      }
      if (!this.options.quiet) {
        // console.log('\nWebpackCleanupPlugin: %s file(s) deleted.', files.length);
      }
    });
  }
}
module.exports = WebpackCleanupPlugin;
```
