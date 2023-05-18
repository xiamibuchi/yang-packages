# 动态加载 js

import 已经支持动态倒入 js。除此之外，可以动态插入 script 标签加载 js。

需要注意：

1. 防止 js 重复加载
2. 判断 js 是否加载成功

```js
function bindListener(script, callback) {
  if (script.addEventListener) {
    script.addEventListener(
      "load",
      () => {
        script.setAttribute("loaded", true);
        callback && callback();
      },
      false
    );
  } else if (script.attachEvent) {
    script.attachEvent("onreadystatechange", () => {
      const target = window.event.srcElement;
      if (target.readyState === "loaded") {
        script.setAttribute("loaded", true);
        callback && callback();
      }
    });
  }
}

export const loadScript = (src, callback) => {
  // 业务内的 js path 前缀可能有其他约定
  const origin = window.location.origin;
  if (!src.startsWith(origin)) {
    src = origin + src;
  }

  return new Promise((resolve) => {
    const targetScript = document.querySelector(`script[src="${src}"]`);
    if (targetScript) {
      if (targetScript.getAttribute("loaded")) {
        // 已载入便不再加载
        resolve();
      } else {
        bindListener(targetScript, resolve);
      }
    } else {
      const script = document.createElement("script");
      const head = document.getElementsByTagName("head")[0];
      script.type = "text/javascript";
      script.charset = "UTF-8";
      script.src = src;
      bindListener(script, resolve);
      head.appendChild(script);
    }
  });
};
```
