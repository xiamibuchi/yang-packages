<template>
  <div class="loading-circle">
    <div class="loading-circle-full" />
  </div>
</template>

<style lang="scss">
$size: 50px;
.loading-circle {
  border: 3px solid rgba(61, 239, 255, 0.2);
  border-top-color: #409eff;
  border-radius: 50%;
  width: $size;
  height: $size;
  animation: loading-circle 2s linear infinite;
}
@keyframes loading-circle {
  100% {
    transform: rotate(1turn);
  }
}
</style>
