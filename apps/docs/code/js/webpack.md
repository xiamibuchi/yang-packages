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
