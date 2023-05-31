<script setup lang="ts"></script>

<template>
  <h2>文字故障</h2>
  <div class="mix-blend-model__break-text" data-text="MixBlendMode">
    MixBlendMode
    <div class="mix-blend-model__break-text__content" />
  </div>
</template>

<style>
.mix-blend-model__break-text {
  position: relative;
  transform: translate(0, 0) skewX(0deg);
  font-size: 48px;
  animation: skewX 5s ease-in infinite;
}
.mix-blend-model__break-text__content {
  position: absolute;
  left: 0;
  top: 15px;
  width: 100%;
  height: 3px;
  background: #fff;
  z-index: 4;
  animation: whiteMove 3s ease-out infinite;
  mix-blend-mode: luminosity;
}

.mix-blend-model__break-text:before {
  content: attr(data-word);
  position: absolute;
  top: 0;
  left: 1px;
  height: 0px;
  color: rgba(255, 0, 0, 0.9);
  overflow: hidden;
  z-index: 2;
  animation: redShadow 1.5s ease-in infinite;
  filter: contrast(200%);
  text-shadow: 0.1px 0 0 red;
  mix-blend-mode: color-burn;
}

.mix-blend-model__break-text:after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: -3px;
  height: 64px;
  color: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  z-index: 3;
  background: rgba(255, 255, 255, 0.9);
  animation: redHeight 2s ease-out infinite;
  filter: contrast(200%);
  mix-blend-mode: hard-light;
}

@keyframes redShadow {
  20% {
    left: -1px;
    height: 32px;
  }
  60% {
    left: 2px;
    height: 6px;
  }
  100% {
    left: -2px;
    height: 42px;
  }
}

@keyframes redHeight {
  20% {
    height: 42px;
  }
  35% {
    height: 12px;
  }
  50% {
    height: 40px;
  }
  60% {
    height: 20px;
  }
  70% {
    height: 34px;
  }
  80% {
    height: 22px;
  }
  100% {
    height: 0px;
  }
}

@keyframes whiteMove {
  8% {
    top: 38px;
  }
  10% {
    top: 8px;
  }
  12% {
    top: 42px;
  }
  99% {
    top: 36px;
  }
}

@keyframes skewX {
  78% {
    transform: skewX(0);
  }
  79% {
    transform: skewX(12deg);
  }
  80% {
    transform: skewX(-12deg);
  }
  81% {
    transform: skewX(0);
  }
}
</style>
