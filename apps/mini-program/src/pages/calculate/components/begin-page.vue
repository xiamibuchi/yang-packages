<script setup lang="ts">
import { Status } from '../config.ts';
const emit = defineEmits(['change-status']);
</script>
<template>
  <view class="begin-page">
    <button @tap="emit('change-status', Status.Middle)">开始</button>
  </view>
</template>
