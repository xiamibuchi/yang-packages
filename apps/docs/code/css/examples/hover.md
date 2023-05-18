<script setup>
import HoverBackground from '../components/hover/HoverBackground.vue'
import HoverBorder from '../components/hover/HoverBorder.vue'
import HoverTip from '../components/hover/HoverTip.vue'
</script>

# hover

## 动态背景

<HoverBackground />

::: details code

```vue
<template>
  <div class="hover-background" @mousemove="handleMouseMove">
    <span>hover to change</span>
  </div>
</template>

<script setup>
const handleMouseMove = (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  e.target.style.setProperty('--x', `${x}px`);
  e.target.style.setProperty('--y', `${y}px`);
};
</script>

<style lang="scss">
.hover-background {
  margin: 0 auto;
  width: 200px;
  padding: 10px 20px;
  text-align: center;
  position: relative;
  background: #f72359;
  color: white;
  font-size: 16px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 100px;
  span {
    position: relative;
  }
  &::before {
    --size: 0;
    content: '';
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: var(--size);
    background: radial-gradient(circle closest-side, #4405f7, transparent);
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease;
  }
  &:hover::before {
    --size: 400px;
  }
}
</style>
```

:::

## 边框动画

<HoverBorder />

::: details code

```vue
<template>
  <div class="hover-border">
    <div class="hover-border__content">hover to change</div>
  </div>
</template>

<style lang="scss">
.hover-border {
  width: 200px;
  height: 60px;
  position: relative;
  background: #fff;
  margin: 0 auto;
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  line-height: 60px;
  &::before,
  &::after {
    content: '';
    width: 0;
    height: 0;
    background: #00adb5;
    position: absolute;
    z-index: 0;
    transition: width 0.5s, height 0.5s;
  }
  &::before {
    top: -1px;
    right: -1px;
  }
  &::after {
    bottom: -1px;
    left: -1px;
  }
  &:hover::before,
  &:hover::after {
    width: calc(100% + 2px);
    height: calc(100% + 2px);
  }
}

.hover-border__content {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background: #fff;
}
</style>
```

:::

## 自定义提示

<HoverTip />

::: details code

```vue
<template>
  <div class="hover-tip" data-title="red" />
</template>

<style lang="scss">
.hover-tip {
  position: relative;
  padding: 2px;
  border: 2px solid transparent;
  border-radius: 100%;
  width: 24px;
  height: 24px;
  background-clip: content-box;
  cursor: pointer;
  transition: all 300ms;
  &::before,
  &::after {
    position: absolute;
    left: 50%;
    bottom: 100%;
    opacity: 0;
    transform: translate3d(0, -30px, 0);
    transition: all 300ms;
  }
  &::before {
    margin: 0 0 12px -35px;
    border-radius: 5px;
    width: 70px;
    height: 30px;
    background-color: rgba(#000, 0.5);
    line-height: 30px;
    text-align: center;
    color: #fff;
    content: attr(data-title);
  }
  &::after {
    margin-left: -6px;
    border: 6px solid transparent;
    border-top-color: rgba(#000, 0.5);
    width: 0;
    height: 0;
    content: '';
  }
  background-color: #f66;
  &:hover {
    border-color: #f66;
  }
  &:hover {
    &::before,
    &::after {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
}
</style>
```

:::
