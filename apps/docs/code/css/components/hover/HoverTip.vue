<template>
  <div class="hover-tip" data-title="red" />
</template>

<style lang="scss">
.hover-tip {
  position: relative;
  padding: 2px;
  border: 2px solid transparent;
  border-radius: 100%;
  width: 24px;
  height: 24px;
  background-clip: content-box;
  cursor: pointer;
  transition: all 300ms;
  &::before,
  &::after {
    position: absolute;
    left: 50%;
    bottom: 100%;
    opacity: 0;
    transform: translate3d(0, -30px, 0);
    transition: all 300ms;
  }
  &::before {
    margin: 0 0 12px -35px;
    border-radius: 5px;
    width: 70px;
    height: 30px;
    background-color: rgba(#000, 0.5);
    line-height: 30px;
    text-align: center;
    color: #fff;
    content: attr(data-title);
  }
  &::after {
    margin-left: -6px;
    border: 6px solid transparent;
    border-top-color: rgba(#000, 0.5);
    width: 0;
    height: 0;
    content: '';
  }
  background-color: #f66;
  &:hover {
    border-color: #f66;
  }
  &:hover {
    &::before,
    &::after {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
}
</style>
