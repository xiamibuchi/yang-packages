<template>
  <div />
</template>

<style scoped lang="scss">
$size: 50px;
div {
  width: $size;
  height: $size;
  position: relative;
  border: 5px solid #409eff;
  overflow: hidden;
  animation: rotate 3s ease infinite;
  &::before {
    content: '';
    width: $size;
    height: $size;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(#409eff, 0.75);
    transform-origin: center bottom;
    transform: scaleY(1);
    animation: fill 3s linear infinite;
  }
}
@keyframes rotate {
  50%,
  100% {
    transform: rotate(1turn);
  }
}
@keyframes fill {
  25%,
  50% {
    transform: scaleY(0);
  }

  to {
    transform: scaleY(1);
  }
}
</style>
