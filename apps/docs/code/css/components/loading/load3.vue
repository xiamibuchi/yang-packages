<template>
  <div>
    <span />
    <span />
    <span />
  </div>
</template>

<style scoped lang="scss">
$size: 14px;
$color: #409eff;
div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row nowrap;
  width: $size * (3 + 1);
}
span {
  width: $size;
  height: $size;
  background-color: $color;
  border-radius: 50%;
  display: inline-block;
  animation: wave 0.8s ease-in-out infinite alternate;
  &:nth-of-type(1) {
    animation-delay: -0.4s;
  }
  &:nth-of-type(2) {
    animation-delay: -0.2s;
  }
}

@keyframes wave {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}
</style>
