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
