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
    top: 100%;
    right: 100%;
    width: $width;
    height: $width;
    border-radius: 50%;
    background-color: $bg-color;
    transform-origin: center;
    transform: translate3d(50%, -50%, 0) scale3d(0, 0, 0);
    transition: transform 0.45s ease-in-out;
  }
  &:hover {
    color: #000;
    &::before {
      transform: translate3d(50%, -50%, 0) scale3d(15, 15, 15);
    }
  }
}
</style>
