<template>
  <div>
    <span />
    <span />
    <span />
    <span />
    <span />
  </div>
</template>

<style scoped lang="scss">
$color: #409eff;
div {
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 10px;
}

span {
  background-color: $color;
  height: 100%;
  width: 6px;
  display: inline-block;
  animation: stretchdelay 1.2s infinite ease-in-out;
  &:nth-of-type(2) {
    animation-delay: -1.1s;
  }
  &:nth-of-type(3) {
    animation-delay: -1s;
  }
  &:nth-of-type(4) {
    animation-delay: -0.9s;
  }
  &:nth-of-type(5) {
    animation-delay: -0.8s;
  }
}

@keyframes stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
</style>
