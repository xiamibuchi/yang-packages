<template>
  <svg class="svg-border" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="linearGradient" x1="0" y1="0" x2="100%" y2="0">
        <stop offset="10%" stop-color="rgb(255, 255 ,0)" />
        <stop offset="100%" stop-color="rgb(0, 255, 255)" />
      </linearGradient>
    </defs>
    <text x="80" y="40" class="text" font-size="30" fill="url(#linearGradient)">
      Hello SVG
    </text>
    <rect class="rect" height="60" width="320" stroke="url(#linearGradient)" />
  </svg>
</template>

<style scoped lang="scss">
.svg-border {
  height: 60px;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: 320px;
}

.rect {
  fill: transparent;
  stroke-dasharray: 200 540;
  stroke-dashoffset: -445;
  stroke-width: 8px;
}
@keyframes draw {
  0% {
    stroke-dasharray: 200 540;
    stroke-dashoffset: -445;
    stroke-width: 8px;
  }
  100% {
    stroke-dasharray: 760;
    stroke-dashoffset: 0;
    stroke-width: 2px;
  }
}

.svg-border:hover .rect {
  animation: 0.5s draw linear forwards;
}
</style>
