<template>
  <div class="hover-border" />
</template>

<style lang="scss">
$height: 60px;
$color: #00adb5;
.hover-border {
  --hover-border-color: #{$color};

  width: 200px;
  height: $height;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  border: 1px solid var(--hover-border-color);

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    transition: width 0.5s, height 0.5s;
  }
  &::before {
    top: -5px;
    left: -5px;
    border-top: 1px solid var(--hover-border-color);
    border-left: 1px solid var(--hover-border-color);
  }
  &::after {
    right: -5px;
    bottom: -5px;
    border-bottom: 1px solid var(--hover-border-color);
    border-right: 1px solid var(--hover-border-color);
  }
  &:hover::before,
  &:hover::after {
    width: calc(100% + 10px);
    height: calc(100% + 10px);
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
