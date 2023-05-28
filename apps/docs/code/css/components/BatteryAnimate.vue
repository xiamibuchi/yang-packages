<template>
  <div class="battery-container">
    <div class="battery" />
  </div>

  <div class="battery-wave-container">
    <div class="battery-wave-header" />
    <div class="battery-wave" />
    <div class="battery-wave-copy">
      <div class="battery-wave-g-wave" />
      <div class="battery-wave-g-wave" />
      <div class="battery-wave-g-wave" />
    </div>
  </div>

  <div class="g-container">
    <div class="g-number">98.7%</div>
    <div class="g-contrast">
      <div class="g-circle" />
      <ul class="g-bubbles">
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
      </ul>
    </div>
  </div>

  <a href="https://juejin.cn/post/6844904029336649741" target="_blank"
    >原文地址</a
  >
</template>

<style lang="scss">
.battery-container {
  position: relative;
  width: 100px;
  margin: auto;
}

.battery {
  height: 160px;
  box-sizing: border-box;
  border-radius: 10px 10px 5px 5px;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.22));
  background: #fff;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    width: 26px;
    height: 10px;
    left: 50%;
    top: 0;
    transform: translate(-50%, -10px);
    border-radius: 5px 5px 0 0;
    background: #fff;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 90%;
    background: linear-gradient(
      to bottom,
      #7abcff 0%,
      #00bcd4 44%,
      #2196f3 100%
    );
    border-radius: 0px 0px 5px 5px;
    box-shadow: 0 14px 28px rgba(33, 150, 243, 0),
      0 10px 10px rgba(9, 188, 215, 0.08);
    animation: charging 6s linear infinite;
    filter: hue-rotate(90deg);
  }
}

@keyframes charging {
  50% {
    box-shadow: 0 14px 28px rgba(0, 150, 136, 0.83),
      0px 4px 10px rgba(9, 188, 215, 0.4);
  }
  95% {
    top: 5%;
    filter: hue-rotate(0deg);
    border-radius: 0 0 5px 5px;
    box-shadow: 0 14px 28px rgba(4, 188, 213, 0.2),
      0 10px 10px rgba(9, 188, 215, 0.08);
  }
  100% {
    top: 0%;
    filter: hue-rotate(0deg);
    border-radius: 15px 15px 5px 5px;
    box-shadow: 0 14px 28px rgba(4, 188, 213, 0),
      0 10px 10px rgba(9, 188, 215, 0.4);
  }
}
</style>

<style lang="scss">
.battery-wave-container {
  position: relative;
  width: 140px;
  margin: 20px auto;
}

.battery-wave-header {
  position: absolute;
  width: 26px;
  height: 10px;
  left: 50%;
  top: 0;
  transform: translate(-50%, -10px);
  border-radius: 5px 5px 0 0;
  background: rgba(255, 255, 255, 0.88);
}

.battery-wave-copy {
  position: absolute;
  top: 0;
  left: 0;
  height: 220px;
  width: 140px;
  border-radius: 15px 15px 5px 5px;
  overflow: hidden;
}

.battery-wave {
  position: relative;
  height: 220px;
  box-sizing: border-box;
  border-radius: 15px 15px 5px 5px;
  box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.22);
  background: #fff;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 80%;
    background: linear-gradient(
      to bottom,
      #7abcff 0%,
      #00bcd4 44%,
      #2196f3 100%
    );
    border-radius: 0px 0px 5px 5px;
    box-shadow: 0 14px 28px rgba(33, 150, 243, 0),
      0 10px 10px rgba(9, 188, 215, 0.08);
    animation: charging-wave 10s linear infinite;
    filter: hue-rotate(90deg);
  }
}

.battery-wave-g-wave {
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 45% 47% 44% 42%;
  bottom: 25px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
  animation: move 10s linear infinite;
}

.g-wave:nth-child(2) {
  border-radius: 38% 46% 43% 47%;
  transform: translate(-50%, 0) rotate(-135deg);
}

.g-wave:nth-child(3) {
  border-radius: 42% 46% 37% 40%;
  transform: translate(-50%, 0) rotate(135deg);
}

@keyframes charging-wave {
  50% {
    box-shadow: 0 14px 28px rgba(0, 150, 136, 0.83),
      0px 4px 10px rgba(9, 188, 215, 0.4);
  }

  95% {
    top: 5%;
    filter: hue-rotate(0deg);
    border-radius: 0 0 5px 5px;
    box-shadow: 0 14px 28px rgba(4, 188, 213, 0.2),
      0 10px 10px rgba(9, 188, 215, 0.08);
  }
  100% {
    top: 0%;
    filter: hue-rotate(0deg);
    border-radius: 15px 15px 5px 5px;
    box-shadow: 0 14px 28px rgba(4, 188, 213, 0),
      0 10px 10px rgba(9, 188, 215, 0.4);
  }
}

@keyframes move {
  100% {
    transform: translate(-50%, -160px) rotate(720deg);
  }
}
</style>

<style lang="scss">
.g-number {
  position: absolute;
  width: 300px;
  top: 27%;
  text-align: center;
  font-size: 32px;
  z-index: 10;
  color: #fff;
}

.g-container {
  position: relative;
  width: 300px;
  height: 400px;
  margin: auto;
}

.g-contrast {
  filter: contrast(10) hue-rotate(0);
  width: 300px;
  height: 400px;
  background-color: #000;
  overflow: hidden;
  animation: hueRotate 10s infinite linear;
}

.g-circle {
  position: relative;
  width: 300px;
  height: 300px;
  box-sizing: border-box;
  filter: blur(8px);

  &::after {
    content: '';
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0);
    width: 200px;
    height: 200px;
    background-color: #00ff6f;
    border-radius: 42% 38% 62% 49% / 45%;
    animation: rotate 10s infinite linear;
  }

  &::before {
    content: '';
    position: absolute;
    width: 176px;
    height: 176px;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: #000;
    z-index: 10;
  }
}

.g-bubbles {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 100px;
  height: 40px;
  transform: translate(-50%, 0);
  border-radius: 100px 100px 0 0;
  background-color: #00ff6f;
  filter: blur(5px);
}

li {
  position: absolute;
  border-radius: 50%;
  background: #00ff6f;
}

@for $i from 0 through 15 {
  li:nth-child(#{$i}) {
    $width: 15 + random(15) + px;
    left: 15 + random(70) + px;
    top: 50%;
    transform: translate(-50%, -50%);
    width: $width;
    height: $width;
    animation: moveToTop
      #{random(6) +
      3}s
      ease-in-out -#{calc(random(5000) / 1000)}s
      infinite;
  }
}

@keyframes rotate {
  50% {
    border-radius: 45% / 42% 38% 58% 49%;
  }
  100% {
    transform: translate(-50%, -50%) rotate(720deg);
  }
}

@keyframes moveToTop {
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0.1;
    transform: translate(-50%, -180px);
  }
}

@keyframes hueRotate {
  100% {
    filter: contrast(15) hue-rotate(360deg);
  }
}
</style>
