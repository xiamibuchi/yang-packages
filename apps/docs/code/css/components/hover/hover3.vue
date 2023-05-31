<template>
  <div>hover</div>
</template>

<style scoped lang="scss">
$bg-color: #e6a23c;
$width: 100px;
$height: 40px;
div {
  width: $width;
  height: $height;
  text-align: center;
  line-height: $height;
  color: #fff;
  background-color: #2d3058;
  position: relative;
  overflow: hidden;
  transition: color 0.4s ease-in-out;
  z-index: 1;
  &::before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: $width;
    height: $width;
    background-color: $bg-color;
    transform-origin: center bottom;
    transform: scaleY(0);
    transition: transform 0.4s ease-in-out;
  }
  &:hover {
    color: #000;
    &::before {
      transform: scaleY(1);
    }
  }
}
</style>
