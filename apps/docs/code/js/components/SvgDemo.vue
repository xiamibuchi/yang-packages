<script lang="ts" setup>
import { ref } from 'vue';

const code = ref(`<svg>
  
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

  <h2>line</h2>
  <svg>
    <line x1="0" y1="0" x2="218" y2="0" />
  </svg>

  <h2>polyline</h2>
  <svg fill="none">
    <polyline points="3 0 30 25 3 50" />
  </svg>

  <h2>rect</h2>
  <svg fill="none">
    <rect x="3" y="3" width="80" height="60" />
    <rect x="3" y="3" width="80" height="60" />
    <line x1="3" y1="19" x2="83" y2="19" />
    <line x1="20" y1="3" x2="20" y2="17" />
  </svg>

  <h2>ellipse</h2>
  <svg>
    <ellipse fill="#fff" cx="43" cy="43" rx="40" ry="40" />
    <ellipse style="fill: #409eff" cx="43" cy="65" rx="5" ry="5" />
    <line style="stroke-width: 8" x1="43" y1="19" x2="43" y2="48" />
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
