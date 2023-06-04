<script lang="ts" setup>
import { ref } from 'vue';

const code = ref(`<svg xmlns="http://www.w3.org/2000/svg">
  
</svg>`);
</script>

<template>
  <el-input
    v-model="code"
    autosize
    type="textarea"
    placeholder="Please input"
  />
  <div v-html="code" />

  <svg x="0px" y="0px" width="0" height="0">
    <defs>
      <filter id="blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
      </filter>

      <filter id="shadow" x="0" y="0">
        <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />
        <feBlend in="SourceGraphic" in2="offOut" mode="normal" />
      </filter>

      <filter id="shadow2" x="0" y="0" width="200%" height="200%">
        <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />
        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>
    </defs>
  </svg>
</template>

<style scoped lang="scss">
svg {
  stroke: #409eff;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
