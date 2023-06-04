<template>
  <svg x="0px" y="0px" width="0" height="0">
    <defs>
      <filter id="blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
      </filter>

      <filter id="shadow" x="0" y="0">
        <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />
        <feBlend in="SourceGraphic" in2="offOut" mode="normal" />
      </filter>

      <filter id="custom-filter">
        <!-- offsetBlur -->
        <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
        <feOffset in="blur" dx="10" dy="10" result="offsetBlur" />

        <!-- merge SourceGraphic + offsetBlur -->
        <feMerge>
          <feMergeNode in="offsetBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>

  <div class="svg-blur" />

  <div class="svg-shadow" />

  <div class="svg-custom-filter" />
</template>

<style scoped lang="scss">
.svg-blur {
  filter: url(#blur);
  background: #409eff;
  width: 50px;
  height: 50px;
}

.svg-shadow {
  filter: url(#shadow);
  background: #409eff;
  width: 50px;
  height: 50px;
}

.svg-custom-filter {
  filter: url(#custom-filter);
  background: #409eff;
  width: 50px;
  height: 50px;
}
</style>
