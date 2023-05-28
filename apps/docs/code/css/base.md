# CSS 基础

## 盒模型

元素的内在盒子是由 margin box、border box、padding box、content box 组成的，这四个盒子由外到内构成了盒模型。

- IE 模型：`box-sizing: border-box`。此模式下，元素的宽度计算为 `border` + `padding` + `content`
- w3c 标准模型：`box-sizing: content-box`。此模式下，元素的宽度计算为 content 的宽度

## 媒体查询

### 常用

```css
/* 深色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: rgb(30, 30, 34);
    --textColor: rgb(150, 150, 154);
    --borderColor: #2c2c3a;
  }
}
```

## 选择器

### 优先级

- !important
- 内联样式：style=""
- ID 选择器：#id
- 类选择器/属性选择器/伪类选择器：.class.active[href=""]
- 元素选择器/关系选择器/伪元素选择器： html+div>span::after
- 通配符选择器：`\*`

### 兄弟选择器

- `>`：选择容器下的直接子代
- `+`：选择紧临的下一个兄弟元素
- `~`：选择随后的所有兄弟元素

### 属性选择器

- [attr]：包含 attr 属性的所有元素
- [attr=val]：仅 attr 属性被赋值为 val 的所有元素
- [attr^=val]：attr 属性值为 val 开头的元素
- [attr*=val]：attr 属性值包含 val 的元素
- [attr$=val]：attr 属性值为 val 结尾的元素
- [attr~=val]：attr 以空格分割的属性值中包含 val 的元素
- [attr|=val]：attr 属性的值是 `val` 或值以 `val-` 开头的元素（注意，这里的 “-” 不是一个错误，这是用来处理语言编码的）

```css
/* 伪正则写法 */
p[class*='text' i] {
  ...;
}

/* not */
a:not([href]) {
  border: 1px solid red;
}
/* 复合选择器 */
a:not([href]):not([target]):not([rel]) {
  border: 1px solid blue;
}

[style*='color: red'] {
  color: blue !important;
}

/* 覆盖行内样式 */
[style*='color: red'] {
  color: blue !important;
}
```

### attr()

`attr(xxx)` 可以读取到对应 DOM 元素标签名为 xxx 的属性的值

配合属性选择器，可以实现

1. 角标功能：

```html
<div count="5">Message</div>

<style>
  div {
    position: relative;
    width: 200px;
    height: 64px;
  }

  div::before {
    content: attr(count);
    ...;
  }
</style>
```

2. 自定义 title

```html
<p class="title" popTitle="文字弹出">这是一段描述性文字</p>
<p class="title" popTitle="标题A">这是一段描述性文字</p>

<style>
  p[popTitle]:hover::before {
    content: attr(popTitle);
    position: absolute;
    bottom: -20px;
    left: 10px;
    font-size: 12px;
    background: linear-gradient(#fff, #eee);
    padding: 2px 6px;
    z-index: 10;
    color: #333;
    border: 1px solid #666;
    border-radius: 5px;
    box-shadow: 1px 1px 1px 1px #999;
  }
</style>
```

> 浏览器自带的 `title` 属性延迟响应是添加一层防抖保护，避免频繁触发，这里也可以通过对伪元素添加一个 100 毫秒级的 `transition-delay` 实现延迟展示。

## color

```css
/* 色彩关键字 */
p {
  color: red;
}

/* 透明 */
p {
  background-color: transparent;
}

/* currentColor */
p {
  background-color: currentColor;
}

/* HSL */
/* hsl and hsla */
p {
  /* green */
  background-color: hsl(120, 100%, 50%);
}
p {
  /* light green with opacity */
  background-color: hsla(120, 100%, 75%, 0.3);
}

/* rgb/rgba */

p {
  /* green */
  background-color: rgb(0, 250, 0);
}
p {
  /* light green with opacity */
  background-color: rgba(0, 250, 0, 0.3);
}

/* hexadecimal colror */
p {
  color: #ffffff;
}
/* hexadecimal colror with transparency */
p {
  background-color: #0000ff80;
} /* 带透明度的蓝色 */
```

### filter

增加滤镜，可用于实现网页置灰等操作

```css
img {
  filter: grayscale(1); /* 灰度 */
  filter: blur(4px); /* 模糊 */
  filter: opacity(20%); /* 透明度 */
  filter: brightness(200%); /* 亮度 */
  filter: drop-shadow(8px 8px 10px blue); /* 阴影 */
  filter: contrast(200%); /* 对比度 */
  filter: hue-rotate(90deg); /* 色相旋转 */
  filter: invert(100%); /* 反转 */
  filter: saturate(800%); /* 饱和度 */
  filter: contrast(200%) brightness(150%); /* 多个滤镜空格分隔 */
}
```

## 布局

### static

最基本的布局方式，按照文档的顺序一个一个显示出来，块元素独占一行，行内元素共享一行

### BFC

BFC（Block Formatting Context）格式化上下文，是 Web 页面中盒模型布局的 CSS 渲染模式，指一个独立的渲染区域或者说是一个隔离的独立容器。

#### 应用

- 防止 margin 重叠
- 清除内部浮动
- 自适应两（多）栏布局
- 防止字体环绕

#### 触发

- html 根元素
- float 的值不为 none
- overflow 的值不为 visible
- display 的值为 inline-block、table-cell、table-caption
- 表格标题 (元素具有 display: table-caption, HTML 表格标题默认属性)
- display: flow-root
- position 的值为 absolute、fixed
- column-span: all 应当总是会创建一个新的格式化上下文，即便具有 column-span: all 的元素并不被包裹在一个多列容器中

#### 特性

- 内部的 Box 会在垂直方向上一个接一个的放置
- 垂直方向上的距离由 margin 决定
- bfc 的区域不会与 float 的元素区域重叠
- 计算 bfc 的高度时，浮动元素也参与计算
- bfc 就是页面上的一个独立容器，容器里面的子元素不会影响外面元素

### flex 布局

在使用 flex 的元素中，默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）
主轴开始的位置称为 `main start`，主轴结束的位置称为 `main end`。
同理，交叉轴开始的位置称为 `cross start`，交叉轴结束的位置称为 `cross end`。
在使用 flex 的子元素中，占据的主轴空间叫做 `main size`，占据的交叉轴空间叫做 `cross size`。

### grid 网格布局

flex 布局虽然强大，但是只能是一维布局，如果要进行二维布局，那么我们还需要使用 grid。

grid 布局又称为“网格布局”，可以实现二维布局方式，和之前的 表格`table`布局差不多，然而，这是使用 CSS 控制的，不是使用 HTML 控制的，同时还可以依赖于媒体查询根据不同的上下文得新定义布局。

### 变量

自定义属性（有时可以称为 CSS 变量或者层叠 variables）是由 CSS 作者定义的实体，这些实体在一个 document 内可以被重用。一般按照自定义属性的符号设置（比如，--main-color: black；）然后使用 var()函数使用。（例如 color: var(--main-color)）

```css
element {
  --main-bg-color: brown;
}

.one {
  color: white;
  background-color: var(--main-bg-color);
}

/* 默认值 */
.two {
  color: var(--my-var, red); /* Red if --my-var is not defined */
}
.three {
  background-color: var(
    --my-var,
    var(--my-background, pink)
  ); /* pink if --my-var and --my-background are not defined */
  color: var(--my-var, red, blue);
}

.custom-bg {
  background-color: rgba(var(--my-var), 0.7);
}
```

### 获取变量

```js
// 从行内样式中中获取变量
element.style.getPropertyValue('--my-var');
// 从任何地方获取到变量
getComputedStyle(element).getPropertyValue('--my-var');
// 在行内样式中设置变量
element.style.setProperty('--my-var', jsVar + 4);
```

## 伪类

- `focus`
- `:focus-within`：子元素 focus 也触发
