<template>
  <div class="hover-background" @mousemove="handleMouseMove">
    <span>hover to change</span>
  </div>
</template>

<script setup>
const handleMouseMove = (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  e.target.style.setProperty('--x', `${x}px`);
  e.target.style.setProperty('--y', `${y}px`);
};
</script>

<style lang="scss">
.hover-background {
  width: 200px;
  padding: 10px 20px;
  text-align: center;
  position: relative;
  background: #f72359;
  color: white;
  font-size: 16px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 100px;
  span {
    position: relative;
  }
  &::before {
    --size: 0;
    content: '';
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: var(--size);
    background: radial-gradient(circle closest-side, #4405f7, transparent);
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease;
  }
  &:hover::before {
    --size: 400px;
  }
}
</style>
