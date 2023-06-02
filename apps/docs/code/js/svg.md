<script setup>
import SvgDemo from './components/SvgDemo.vue'
</script>

# svg

## 基本元素

- `<svg>`：包裹并定义整个矢量图
- `<line>`：直线
- `<polyline>`：折线
- `<rect>`：创建矩形。
- `<ellipse>`：圆和椭圆
- `<polygon>`：多边形
- `<path>`：通过指定点以及点和点之间的线来创建任意形状
- `<defs>`：定义一个可复用的图形。初始情况下 内部内容是不可见的
- `<g>`：将多种形状组合起来。将组合后的形状置于`<defs>`中可以让它能够被复用
- `<symbol>`：类似于一个组合，但是拥有一些额外的特性。通常被置于`<defs>`标签中便于复用
- `<use>`：获取在`<defs>`中定义的复用对象并在显示出来

## line

`x1`：起点的横轴坐标
`y1`：起点的纵轴坐标
`x2`：终点的横轴坐标
`y2`：终点的纵轴坐标

```html
<svg>
  <line x1="0" y1="0" x2="218" y2="0"></line>
</svg>
```

## polyline/polygon

```html
<svg>
  <polyline points="3 3 30 28 3 53"></polyline>
</svg>
```

## rect

```html
<svg fill="none">
  <rect x="3" y="3" width="80" height="60" />
  <rect x="3" y="3" width="80" height="60" />
  <line x1="3" y1="19" x2="83" y2="19" />
  <line x1="20" y1="3" x2="20" y2="17" />
</svg>
```

## circle

```html
<svg>
  <circle cx="100" cy="100" r="50" />
</svg>
```

## ellipse

`points`：坐标的集合

## 在线编辑

<SvgDemo />
