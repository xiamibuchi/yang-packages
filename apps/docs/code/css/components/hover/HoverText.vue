<template>
  <p class="hover-text">
    <span class="hover-text__inner">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia nostrum
      placeat consequatur deserunt velit ducimus possimus commodi temporibus
      debitis quam, molestiae laboriosam sit repellendus sed sapiente quidem
      quod accusantium vero.
    </span>
    <span class="hover-text__pesudo">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia nostrum
      placeat consequatur deserunt velit ducimus possimus commodi temporibus
      debitis quam, molestiae laboriosam sit repellendus sed sapiente quidem
      quod accusantium vero.
    </span>
  </p>
</template>

<style lang="scss">
.hover-text {
  position: relative;
  font-size: 24px;
  line-height: 2;
  color: #666;
  cursor: pointer;
  &:hover {
    .hover-text__inner,
    .hover-text__pesudo {
      background-size: 500% 100%;
    }
  }
}
.hover-text__inner {
  position: absolute;
  top: 0;
  left: 0;
  color: #000;
}
.hover-text__pesudo {
  position: relative;
  background: linear-gradient(90deg, transparent, #fff 20%, #fff);
  background-size: 0 100%;
  background-repeat: no-repeat;
  background-position: 100% 100%;
  transition: all 3s linear;
  color: transparent;
}
</style>
