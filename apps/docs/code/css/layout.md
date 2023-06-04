<script setup>
import LayoutTicket from './components/LayoutTicket.vue'
</script>

# 布局

## flex 布局

在使用 flex 的元素中，默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）
主轴开始的位置称为 `main start`，主轴结束的位置称为 `main end`。
同理，交叉轴开始的位置称为 `cross start`，交叉轴结束的位置称为 `cross end`。
在使用 flex 的子元素中，占据的主轴空间叫做 `main size`，占据的交叉轴空间叫做 `cross size`。

## grid 网格布局

grid 布局又称为“网格布局”，可以实现二维布局方式，和之前的 表格`table`布局差不多，然而，这是使用 CSS 控制的，不是使用 HTML 控制的，同时还可以依赖于媒体查询根据不同的上下文得新定义布局。

[grid.layoutit](https://grid.layoutit.com/)

## clip

- clip-path
- backgrond-clip
- text-fill-color
- text-stroke

## 演示

<LayoutTicket />
