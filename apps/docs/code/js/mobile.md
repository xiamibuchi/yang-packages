# mobile

## 键盘

### [enterkeyhint](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/enterkeyhint)

用于定义虚拟键盘右下角按钮展示的内容

- enter
- done
- go
- next
- previous
- search
- send

```html
<!-- 虚拟键盘右下角按钮展示“搜索” -->
<textarea enterkeyhint="search" />
```

## deep linking

### URI Schemes

`scheme://path?query`

iOS 9 前常用的方式

问题：

- 当要被唤起的 app 没有安装时，这个链接无用
- 多个相同 scheme 无法区分

### 其他 deep linking

Android：

- [Deep links](https://developer.android.com/training/app-links/deep-linking)
- [App Link](https://developer.android.google.cn/training/app-links)

相较于 Deep Link，App Link：

1. 不支持 custom scheme，仅可为 HTTP/HTTPS
2. 网页需要通过指定[digital-asset-links](https://developers.google.com/digital-asset-links/v1/getting-started)指向该网站网址的链接在指定应用打开，即 assetlinks.json（需通过 robots.txt 或其他手段允许抓取改文件）
3. 可直接唤起 app，Deep Links 会显示 dialog 让用户选择打开 web 还是 app

iOS：

- ：[Universal Link](https://developer.apple.com/ios/universal-links/)(>=iOS 9)
  - 本身是 HTTP/HTTPS 链接，兼容 web 和 app 状态
  - app 已安装，app 就会立即启动；未安装时，默认地重定向到 App Store 的 app 页

### Deferred deep linking

浏览器打开 deep linking 时未安装对应 app，用户完成安装后跳转到 deep linking 对应的 app 页面

方式：

1. 剪切板
2. 通过埋点信息上报，匹配用户打开地址
3. Google Play 上的应用可直接配置

### 一些系统的特殊实现

[vivo 直达应用服务（deep link）](https://dev.vivo.com.cn/documentCenter/doc/216#w2-77940301)

### 常用软件 uri

- 微信：
  - weixin://
  - 扫码：weixin://scanqrcode
- 支付宝
  - alipays://
- 网易云
  - orpheuswidget://
  - 听歌识曲：orpheuswidget://recognize
- QQ
  - mqqapi://
  - 扫一扫：mqqapi://qrcode/scan_qrcode?version=1&src_type=app

[捷径社区](https://sharecuts.cn/app/414478124)

## 折叠屏

[Device Posture API](https://w3c.github.io/device-posture/)

```scss
// 屏幕水平，布局视图跨越单个折叠（两个屏幕）且折叠姿势是垂直
@media (spanning: single-fold-vertical) {
}
// 屏幕垂直，布局视图跨越单个折叠（两个屏幕）并且折叠姿势是水平时（分上下）
@media (spanning: single-fold-horizontal) {
}

@media (screen-fold-posture: laptop) {
}
// 最大折叠角度
@media (max-screen-fold-angle: 120deg) {
}
```

## 常用

### 阻止虚拟键盘弹出

1. 表单 readonly 属性：表单变为只读
2. js 取消聚焦：document.activeElement.blur()

### 主屏幕启动

iOS:

1. 如果仅在'a'标签中使用属性 'href'和'\_blank'，则将在浏览器中打开新标签页。如果使用 `window.open(url, '_blank');`，则新页面将处于独立模式。

### safe area 安全区

综合考虑 css 兼容方案和 js 查询之后，采取了如下方案：

standalone 模式下，最外层会套一个 'standalone-layout' 的类名
在 sass 样式书写时，可以直接使用预先定义好的 mixin：

```css
@include add-safe-top(height, 20);
@include add-safe-bottom(padding-bottom, 20);
@include subtract-safe-bottom(margin-bottom, 20);
```

当应用以全屏模式 ( display-mode: standalone ) 启动时, 因为 系统的状态栏 和 应用的顶部导航栏(top-nav-bar) 重合导致顶部导航不可操作。解决思路，针对 display-mode 做显示区分
利用 CSS 的媒体查询方法, 对于全屏启动的应用, 给其留下安全边距; 对于浏览器中的应用, 不保留安全边距(由浏览器控制)

媒体查询显示模式

```css
// 以 padding-top 为例, 借助于 SASS 的mixin写法, 复用样式
@mixin padding-top-safe-area {
  @media all and (display-mode: standalone) {
    content: '非全屏模式';
    padding-top: 0px;
  }
  @media not all and (display-mode: standalone) {
    content: '全屏启动';
    padding-top: 20px;
  }
}
```

发现这段代码在 iOS 9, iOS10 上都不生效. 原因是它们不支持 display-mode 的媒体查询. https://caniuse.com/#search=display-mode

但是事实上, 它们又支持将网站添加到屏幕上, 全屏启动. 针对这种情况, 利用 CSS 的覆盖特性, 写好 fallback 样式.

此时会产生一个问题: 如果预留安全边距, 则会导致影响浏览器的样式. 如果不预留安全边距, 则会影响 FullScreen 的样式.

兼容 safari13 以下

```css
@mixin padding-top-safe-area {
  // 不支持 display-mode 的设备, 预留安全边距
  padding-top: 20px;
  @media all and (display-mode: standalone) {
    content: '非全屏模式';
    padding-top: 0px;
  }
  @media not all and (display-mode: standalone) {
    content: '全屏启动';
    padding-top: 20px;
  }
}
```

关于安全区
使用 CSS 内置的环境变量 env(safe-area-inset-top) 可以获取到状态栏的高度, 从而避免内容和状态栏重叠. 所以常见的会有这种写法:

safe-area 常见写法

```css
@mixin padding-top-safe-area {
  padding-top: 12px; // fallback
  padding-top: constant(safe-area-inset-top); // iOS11 支持
  padding-top: env(safe-area-inset-top); // iOS12+ 支持
}
```

https://stackoverflow.com/questions/47302707/css-safe-area-attributes-doesnt-work-on-iphone-x/47895315#47895315

https://stackoverflow.com/questions/52476016/envsafe-area-inset-top-not-working-on-android-pie-webview-69

即, 某些情况下, 无刘海设备给出的 safe-area-inset-top 为 0。这就会导致设置的 fallback 不生效.

而且以上写法在 iOS9, iOS10 也不会生效.

猜测, 应该和 safari 的样式规则有关. (由于 mac safari 的版本和 模拟器的 ios safari 版本不一致, 所以无法查看具体的样式情况).

支持的写法为:

```css
@mixin padding-top-safe-area {
  padding-top: 20px;
  @supports (top: constant(safe-area-inset-top)) {
    padding-top: constant(safe-area-inset-top);
  }
  @supports (top: env(safe-area-inset-top)) {
    padding-top: env(safe-area-inset-top);
  }
}
```

所以兼顾 兼容性 和 特殊情况(safe-area-inset-top: 0) 为了避免状态栏和导航栏的重叠, 应该保留一个最小的安全内距(可以使用 max 来实现), 考虑可以写法:

兼容性 && 特殊情况

```css
padding-top: 20px;
@supports (top: constant(safe-area-inset-top)) {
  padding-top: max(20px, constant(safe-area-inset-top));
}
@supports (top: env(safe-area-inset-top)) {
  padding-top: max(20px, env(safe-area-inset-top));
}
```

以上写法会在 .scss 文件中报错, 原因是 scss-loader 会对 scss 文件进行编译, 而此时 css 环境变量不存在, 因此会抛出

`env(safe-area-inset-top) is not a number​.`

可以借助 sass 提供的 unquote 函数来解决这个问题. unquote 会去掉括号中的首尾的引号, 当编译时括号内的内容会被直接当作字符串处理:

sass 写法

```css
@mixin padding-top-safe-area() {
  padding-top: 20px;
  @supports (top: constant(safe-area-inset-top)) {
    padding-top: unquote('max(20px,constant(safe-area-inset-top))');
  }
  @supports (top: env(safe-area-inset-top)) {
    padding-top: unquote('max(20px, env(safe-area-inset-top))');
  }
}
```

结论：忽略 不支持媒体查询的设备 在浏览器端体验的情况下 (可以通过 js 做细节处理), 兼顾兼容性和特殊情况可以有如下代码:

```css
// 为了更好的使用混入, 使用带参数的 mixin,支持带参的混入
@mixin padding-top-safe-area($offsetTop: 0px) {
  // not support display-mode
  padding-top: unquote('calc(#{$offsetTop} + 20px)');
  @supports (top: constant(safe-area-inset-top)) {
    padding-top: unquote(
      'calc(#{$offsetTop} + max(20px,constant(safe-area-inset-top)))'
    );
  }
  @supports (top: env(safe-area-inset-top)) {
    padding-top: unquote(
      'calc(#{$offsetTop} + max(20px, env(safe-area-inset-top)))'
    );
  }
  @media not all and (display-mode: standalone) {
    padding-top: unquote('calc(#{$offsetTop} + 0px)');
  }
  //@media all and (display-mode: standalone) {
  //  padding-top: unquote("calc(#{$offsetTop} + 20px)");
  //  @supports (top: constant(safe-area-inset-top)) {
  //    padding-top: unquote("calc(#{$offsetTop} + max(20px,constant(safe-area-inset-top)))");
  //  }
  //  @supports (top: env(safe-area-inset-top)) {
  //    padding-top: unquote("calc(#{$offsetTop} + max(20px, env(safe-area-inset-top)))");
  //  }
  //}
}
```

> 在 ios standalone 模式下，默认情况（页面无内容）下 html 高度并不会占满屏幕，会缺少导航栏高度。此时 position: fixed; bottom: 0; 的元素会距离屏幕底部有一段距离（即导航栏高度），直到页面内容高度>=屏幕高度，将 html 撑开至页面高度。处理方式：给定页面容器 min-height: 100vh; 撑开 html
