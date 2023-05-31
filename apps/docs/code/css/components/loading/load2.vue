<template>
  <div>
    <span />
    <span />
    <span />
  </div>
</template>

<style scoped lang="scss">
$size: 14px;
div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row nowrap;
  width: $size * (3 + 2);
}
span {
  width: $size;
  height: $size;
  background-color: #409eff;
  border-radius: 50%;
  display: inline-block;
  &:nth-of-type(1) {
    transform: translateX(-100%);
    animation: left-swing 0.5s ease-in infinite alternate;
  }
  &:nth-of-type(3) {
    transform: translateX(-95%);
    animation: right-swing 0.5s ease-out infinite alternate;
  }
}

@keyframes left-swing {
  50%,
  to {
    transform: translateX(95%);
  }
}
@keyframes right-swing {
  50% {
    transform: translateX(-95%);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
