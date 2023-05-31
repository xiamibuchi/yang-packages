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
    left: 50%;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: $bg-color;
    transform-origin: center;
    transform: translate(-50%) scaleX(0);
    transition: transform 0.3s ease;
  }
  &:hover {
    &::before {
      transform: translate(-50%) scaleX(1);
    }
  }
}
</style>
