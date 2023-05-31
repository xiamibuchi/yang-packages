<template>
  <svg class="loading-svg-circle" viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="20" />
  </svg>
</template>

<style lang="scss">
.loading-svg-circle {
  width: 50px;
  transform-origin: center;
  animation: loading-svg-circle 2s linear infinite;
  circle {
    box-sizing: border-box;
    fill: none;
    stroke: #409eff;
    stroke-width: 2;
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: loading-svg-circle-inner 1.5s linear infinite;
  }
}

@keyframes loading-svg-circle {
  100% {
    transform: rotate(1turn);
  }
}
@keyframes loading-svg-circle-inner {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dashoffset: -125px;
  }
}
</style>
