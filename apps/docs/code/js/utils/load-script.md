# 动态加载 js

## import

```js
import('remote_js_href');
```

## 动态插入 script 标签

1. 防止 js 重复加载
2. 判断 js 是否加载成功

```js
const bindListener = (script, callback) => {
  const onLoaded = () => {
    script.setAttribute('loaded', true);
    script.removeEventListener('load', onLoaded);
    callback && callback();
  };
  script.addEventListener('load', onLoaded, false);
};

export const loadScript = (src) => {
  // 业务内的 js path 前缀可能不同
  const origin = window.location.origin;
  if (!src.startsWith(origin)) {
    src = origin + src;
  }

  return new Promise((resolve) => {
    const targetScript = document.querySelector(`script[src="${src}"]`);
    if (targetScript) {
      if (targetScript.getAttribute('loaded')) {
        // 防止重复加载
        resolve();
      } else {
        bindListener(targetScript, resolve);
      }
    } else {
      const script = document.createElement('script');
      const head = document.getElementsByTagName('head')[0];
      script.type = 'text/javascript';
      script.src = src;
      bindListener(script, resolve);
      head.appendChild(script);
    }
  });
};
```
