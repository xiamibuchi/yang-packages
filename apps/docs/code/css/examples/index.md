# 常用样式

- [hover](./hover)
- [loading](./loading)
- [mix-blend-mode](./mix-blend-mode)
- [battery](./battery)

## 字体

```css
div {
  /* 无衬线字体 */
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Heiti SC', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;

  /* 楷体 */
  font-family: '楷体', '楷体_GB2312', 'Kaiti SC Regular', 'KaiTi', 'SimKai',
    'STKaiti', 'serif';
}
```

## 适配

REM:

```scss
$default-width: 375;
body {
  font-size: 100vh / $default-width;
  // PC 的用 meida-query 设置对应 font-size 即可
}

@function vw($px) {
  @return #{($px / $default-width / 1px)}rem;
}

div {
  font-size: vw(16px);
}
```
