<template>
  <div />
</template>

<style lang="scss" scoped>
$color: #409eff;
div {
  width: 48px;
  height: 48px;
  color: $color;
  --bg: linear-gradient(currentColor 0 0);
  background: var(--bg) 0 100%, var(--bg) 50% 100%, var(--bg) 100% 100%;
  background-size: 20% calc(100% - 4px);
  background-repeat: no-repeat;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 20%;
    height: 20%;
    border-radius: 50%;
    background: currentColor;
    left: 0;
    top: 0;
    animation: loading-dot-1 1.5s linear infinite alternate,
      loading-dot-2 0.75s cubic-bezier(0, 200, 0.8, 200) infinite;
  }
}

@keyframes loading-dot-1 {
  100% {
    left: calc(100% - 8px);
  }
}
@keyframes loading-dot-2 {
  100% {
    top: -0.1px;
  }
}
</style>
