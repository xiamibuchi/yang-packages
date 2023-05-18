<template>
  <div class="loading-circle-container">
    <svg id="loading-circle" x="0px" y="0px" viewBox="0 0 150 150">
      <circle id="loading-circle-inner" cx="75" cy="75" r="60" />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.loading-circle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  height: 150px;
}

#loading-circle {
  width: 75px;
  animation: loading-circle 3s linear infinite;
}
#loading-circle-inner {
  stroke: {
    dashoffset: 0;
    dasharray: 300;
    width: 10;
    miterlimit: 10;
    linecap: round;
  }
  animation: loading-circle-inner 2s linear infinite;
  stroke: #00adb5;
  fill: transparent;
}

@keyframes loading-circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes loading-circle-inner {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -600;
  }
}
</style>
