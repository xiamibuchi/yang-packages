<script setup>
import SvgDemo from './components/SvgDemo.vue'
import SvgAnimation from './components/SvgAnimation.vue'
import SvgFilter from './components/SvgFilter.vue'
</script>

# svg

Scalable Vector Graphics，可缩放矢量图形。

## viewBox

<svg fill="#409eff" width="60" height="60" viewBox="0 0 100 100">
  <circle cx="100" cy="100" r="100" />
</svg>

```html
<svg fill="#409eff" width="60" height="60" viewBox="0 0 100 100">
  <circle cx="100" cy="100" r="100" />
</svg>
```

viewBox 定义了从（0, 0）点开始，(100. 100) 结束的显示区域，但只给了 60 \* 60 的宽高，因此圆只显示了 1/4

## 样式

- fill：填充颜色
- fill-opacity：填充颜色的透明度，也可直接在 fill 里用 rgba 等带透明度的颜色
- stroke：描边颜色
- stroke-width：描边宽度
- stroke-linecap：线的起始点和结束点样式
  - butt：平头（默认值）
  - round：圆头
  - square：方头
- stroke-linejoin：线的交接点样式
  - miter：尖角（默认）
  - round：圆角
  - bevel：平角

## 基本元素

- `<svg xmlns="http://www.w3.org/2000/svg">`：包裹并定义整个矢量图
- `<line>`：直线
- `<polyline>`：折线
- `<rect>`：矩形
- `<circle>`：圆
- `<ellipse>`：圆和椭圆
- `<polygon>`：多边形
- `<path>`：通过指定点以及点和点之间的线来创建任意形状
- `<defs>`：定义一个可复用的图形。初始情况下 内部内容是不可见的
- `<g>`：将多种形状组合起来。将组合后的形状置于`<defs>`中可以让它能够被复用
- `<symbol>`：类似于一个组合，但是拥有一些额外的特性。通常被置于`<defs>`标签中便于复用
- `<use>`：获取在`<defs>`中定义的复用对象并在显示出来
- `<text>`：文本

## line

`x1`：起点的横轴坐标
`y1`：起点的纵轴坐标
`x2`：终点的横轴坐标
`y2`：终点的纵轴坐标

```html
<svg xmlns="http://www.w3.org/2000/svg">
  <line x1="0" y1="0" x2="218" y2="0"></line>
</svg>
```

<svg height="3px" stroke="#409eff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <line x1="0" y1="0" x2="218" y2="0" />
</svg>

## polyline/polygon

`points`：坐标的集合

```html
<svg xmlns="http://www.w3.org/2000/svg">
  <polyline points="3 3 30 28 3 53"></polyline>
</svg>

<svg xmlns="http://www.w3.org/2000/svg">
  <polygon points="3 3 30 28 3 53"></polyline>
</svg>
```

<svg width="32px" height="55px" stroke="#409eff" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"  fill="none">
  <polyline points="3 0 30 25 3 50" />
</svg>

<svg width="32px" height="55px" stroke="#409eff" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
  <polygon points="3 0 30 25 3 50" />
</svg>

## rect

<svg width="85px" height="65px" stroke="#409eff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" fill="none">
  <rect x="3" y="3" width="80" height="60" />
  <rect x="3" y="3" width="80" height="60" />
  <line x1="3" y1="19" x2="83" y2="19" />
  <line x1="20" y1="3" x2="20" y2="17" />
</svg>

```html
<svg
  stroke="#409eff"
  stroke-width="3"
  stroke-linecap="round"
  stroke-linejoin="round"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
>
  <rect x="3" y="3" width="80" height="60" />
  <rect x="3" y="3" width="80" height="60" />
  <line x1="3" y1="19" x2="83" y2="19" />
  <line x1="20" y1="3" x2="20" y2="17" />
</svg>
```

## circle

```html
<svg stroke="#409eff" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="50" />
</svg>
```

<svg fill="#409eff" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="50" />
</svg>

## ellipse

<svg width="85px" height="85px" stroke="#409eff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <ellipse fill="#fff" cx="43" cy="43" rx="40" ry="40" />
  <ellipse style="fill: #409eff" cx="43" cy="65" rx="5" ry="5" />
  <line style="stroke-width: 8" x1="43" y1="19" x2="43" y2="48" />
</svg>

```html
<svg
  stroke="#409eff"
  stroke-width="3"
  stroke-linecap="round"
  stroke-linejoin="round"
  xmlns="http://www.w3.org/2000/svg"
>
  <ellipse fill="#fff" cx="43" cy="43" rx="40" ry="40" />
  <ellipse style="fill: #409eff" cx="43" cy="65" rx="5" ry="5" />
  <line style="stroke-width: 8" x1="43" y1="19" x2="43" y2="48" />
</svg>
```

## path

- M：Move to
- L：Line to
- H：Horizontal Line to
- V：Vertical Line to
- Q：Quadratic Bezier Curve to
- T：Smooth Quadratic Bezier Curve to
- C：Curve to
- S：Smooth Curve to
- A：Elliptical Arc
- Z：close path

```html
<svg width="150" height="150">
  <path
    d="M50 50 H 200 V 200 H 50 L 50 50"
    fill="none"
    style="stroke: #000000;"
  />
</svg>
```

<svg width="202" height="202">
  <path d="M50 50 H 200 V 200 H 50 L 50 50" fill="none" style="stroke: #409eff;"/>
</svg>

## 滤镜

<SvgFilter />

## 动画

<SvgAnimation />

## 在线编辑

<SvgDemo />

## 参考

- [案例+图解带你一文读懂 SVG](https://juejin.cn/post/7124312346947764260)
- [SVG 滤镜从入门到放弃](https://juejin.cn/post/6943032791122575390)
