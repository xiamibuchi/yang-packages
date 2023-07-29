<template>
  <div />
</template>

<style lang="scss" scoped>
$color: #409eff;
div {
  width: 40px;
  height: 40px;
  color: $color;
  --bg: linear-gradient(currentColor 0 0);
  background: var(--bg) 0 0, var(--bg) 0 100%, var(--bg) 50% 0,
    var(--bg) 50% 100%, var(--bg) 100% 0, var(--bg) 100% 100%;
  background-size: 8px 50%;
  background-repeat: no-repeat;
  animation: db8-0 2s infinite;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    top: calc(50% - 4px);
    left: -8px;
    animation: inherit;
    animation-name: db8-1;
  }
}
@keyframes db8-0 {
  16.67% {
    background-size: 8px 30%, 8px 30%, 8px 50%, 8px 50%, 8px 50%, 8px 50%;
  }
  33.33% {
    background-size: 8px 30%, 8px 30%, 8px 30%, 8px 30%, 8px 50%, 8px 50%;
  }
  50% {
    background-size: 8px 30%, 8px 30%, 8px 30%, 8px 30%, 8px 50%, 8px 50%;
  }
  66.67% {
    background-size: 8px 50%, 8px 50%, 8px 30%, 8px 30%, 8px 50%, 8px 50%;
  }
  83.33% {
    background-size: 8px 50%, 8px 50%, 8px 50%, 8px 50%, 8px 50%, 8px 50%;
  }
}

@keyframes db8-1 {
  20% {
    left: 0px;
  }
  40%,
  100% {
    left: calc(50% - 4px);
  }
}
</style>
