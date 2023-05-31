<template>
  <div>
    <input type="text" placeholder="focus" />
    <span />
  </div>
</template>

<style scoped lang="scss">
$color: #909399;
$active-color: #409eff;
$width: 100px;
div {
  position: relative;
  &:focus-within {
    span {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
}
input {
  width: $width;
  font-size: inherit;
  font-family: inherit;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid $color;
  outline: 0;
}
span {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: $active-color;
  transform-origin: bottom right;
  transform: scaleX(0);
  transition: transform 1s ease;
}
</style>
