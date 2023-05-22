# 异形屏适配

对于异形屏的适配，主要针对 iPhone，安卓的机型的 webview 会自动切掉异形屏的部分。

## viewport-fit

iOS11 新增特性，苹果公司为了适配 iPhoneX 对现有 viewport meta 标签的一个扩展，用于设置网页在可视窗口的布局方式，可设置三个值：

- contain: 可视窗口完全包含网页内容
- cover：网页内容完全覆盖可视窗口
- auto：默认值，跟 contain 表现一致

env() 和 constant()

iOS11 新增特性，Webkit 的一个 CSS 函数，用于设定安全区域与边界的距离，有四个预定义的变量：

safe-area-inset-left：安全区域距离左边边界距离
safe-area-inset-right：安全区域距离右边边界距离
safe-area-inset-top：安全区域距离顶部边界距离
safe-area-inset-bottom：安全区域距离底部边界距离

> 注意：当 viewport-fit=contain 时 env() 是不起作用的，必须要配合 viewport-fit=cover 使用。对于不支持 env() 的浏览器，浏览器将会忽略它。

在这之前，笔者使用的是 constant()，后来，官方文档加了这么一段注释（坑）：

> The env() function shipped in iOS 11 with the name constant(). Beginning with Safari Technology Preview 41 and the iOS 11.2 beta, constant() has been removed and replaced with env(). You can use the CSS fallback mechanism to support both versions, if necessary, but should prefer env() going forward.

这就意味着，之前使用的 constant() 在 iOS11.2 之后就不能使用的，但我们还是需要做向后兼容，像这样：

```css
div {
  /* iOS < 11.2 */
  margin-bottom: constant(safe-area-inset-bottom);
  /* iOS >= 11.2 */
  margin-bottom: env(safe-area-inset-bottom);
}
```

## @supports 隔离兼容样式

```css
@supports (bottom: constant(safe-area-inset-bottom)) or
  (bottom: env(safe-area-inset-bottom)) {
  div {
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
  }
}
```
