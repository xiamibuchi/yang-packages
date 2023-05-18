# 调试

## 移动端调试

1. ios 手机连接到 pc

设置手机 safari 设置-》safari-》高级-》打开 web 检查器 （授权调试功能） 2. [安装 ios_webkit_debug_proxy](https://github.com/google/ios-webkit-debug-proxy)。 1. 安装 scoop 2. 通过 scoop 安装 ios_webkit_debug_proxy 3. 连接测试
确认手机已连接 pc，输入
ios_webkit_debug_proxy -f chrome-devtools://devtools/bundled/inspector.html
在 localhost:9221 中查看设备连接情况，此时可看到连接设备的地址。

在 chrome://inspect/#devices 添加设备端口

此时手机通过 safari 访问网页，刷新 chrome://inspect/#devices

## chrome

- console
- [devtools](https://developer.chrome.com/docs/devtools/overview/)

## vConsole

[Github](https://github.com/Tencent/vConsole)

```html
<script
  type="text/javascript"
  src="https://cdn.bootcss.com/vConsole/3.13.0/vconsole.min.js"
></script>
<script>
  // 初始化
  var vConsole = new VConsole();
  console.log('Hello world');
</script>
```

## vue

线上调起 vue 浏览器插件

```js
(function () {
  'use strict';
  const all = document.querySelectorAll('*');
  let el;
  for (let i = 0; i < all.length; i++) {
    if (all[i].__vue__) {
      el = all[i];
      break;
    }
  }
  if (el) {
    console.log('use vue', el);
    let Vue = Object.getPrototypeOf(el.__vue__).constructor;
    while (Vue.super) {
      Vue = Vue.super;
    }
    Vue.config.devtools = true;
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue;
    console.log(Vue.version);
  } else {
    console.log('not use vue');
  }
})();
```

## 自定义 ca 证书

[local-cert-generator](https://github.com/dakshshah96/local-cert-generator)
