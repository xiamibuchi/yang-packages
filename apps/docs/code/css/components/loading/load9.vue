<template>
  <div />
</template>

<style lang="scss" scoped>
$color: #409eff;
div {
  width: 48px;
  height: 48px;
  color: $color;
  --bg: radial-gradient(farthest-side, currentColor 93%, #0000);
  background: var(--bg) 0 0, var(--bg) 50% 0;
  background-size: 20% 20%;
  background-repeat: no-repeat;
  position: relative;
  clip-path: inset(-200% -100% 0 0);
  animation: dot-0 1.5s linear infinite;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 20%;
    height: 12px;
    background: currentColor;
    left: -16px;
    top: 0;
    animation: dot-1 1.5s linear infinite,
      dot-2 0.5s cubic-bezier(0, 200, 0.8, 200) infinite;
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0 0 auto auto;
    width: 20%;
    height: 20%;
    border-radius: 50%;
    background: currentColor;
    animation: dot-3 1.5s linear infinite;
  }
}
@keyframes dot-0 {
  0%,
  30% {
    background-position: 0 0, 50% 0;
  }
  33% {
    background-position: 0 100%, 50% 0;
  }
  41%,
  63% {
    background-position: 0 0, 50% 0;
  }
  66% {
    background-position: 0 0, 50% 100%;
  }
  74%,
  100% {
    background-position: 0 0, 50% 0;
  }
}
@keyframes dot-1 {
  90% {
    transform: translateY(0);
  }
  95% {
    transform: translateY(15px);
  }
  100% {
    transform: translateY(15px);
    left: calc(100% - 8px);
  }
}

@keyframes dot-2 {
  100% {
    top: -0.1px;
  }
}

@keyframes dot-3 {
  0%,
  80%,
  100% {
    transform: translate(0);
  }
  90% {
    transform: translate(26px);
  }
}
</style>
