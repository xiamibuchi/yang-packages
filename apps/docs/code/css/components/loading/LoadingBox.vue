<template>
  <div />
</template>

<style scoped lang="scss">
$color: #409eff;
div {
  width: 50px;
  height: 50px;
  position: relative;
  &:before {
    content: '';
    width: 50px;
    height: 5px;
    background: #000;
    opacity: 0.1;
    position: absolute;
    top: 59px;
    left: 0;
    border-radius: 50%;
    animation: loading-box-shadow 0.5s linear infinite;
  }
  &:after {
    content: '';
    width: 50px;
    height: 50px;
    background: $color;
    animation: loading-box-animate 0.5s linear infinite;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 3px;
  }
}

@keyframes loading-box-animate {
  17% {
    border-bottom-right-radius: 3px;
  }
  25% {
    transform: translateY(9px) rotate(22.5deg);
  }
  50% {
    transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 40px;
  }
  75% {
    transform: translateY(9px) rotate(67.5deg);
  }
  100% {
    transform: translateY(0) rotate(90deg);
  }
}

@keyframes loading-box-shadow {
  0%,
  100% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.2, 1);
  }
}
</style>
