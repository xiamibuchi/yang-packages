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
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: $size * (3 + 1.5);
}
span {
  width: $size;
  height: $size;
  background-color: $color;
  border-radius: 50%;
  display: inline-block;
  animation: fade 0.8s infinite ease-in-out alternate;
  &:nth-of-type(1) {
    animation-delay: -0.4s;
  }
  &:nth-of-type(2) {
    animation-delay: -0.2s;
  }
}

@keyframes fade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
