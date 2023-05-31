<template>
  <div>hover</div>
</template>

<style scoped lang="scss">
$bg-color: #409eff;
$width: 100px;
$height: 40px;
div {
  width: $width;
  height: $height;
  text-align: center;
  line-height: $height;
  color: #000;
  position: relative;
  overflow: hidden;
  transition: color 0.4s ease-in-out;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: $bg-color;
    transform-origin: bottom right;
    transform: scaleX(0);
    transition: transform 0.5s ease;
  }
  &:hover {
    &::before {
      transform-origin: bottom left;
      transform: scaleX(1);
    }
  }
}
</style>
