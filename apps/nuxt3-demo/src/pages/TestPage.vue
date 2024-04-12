<script setup lang="ts">
import { useAppConfig, useState } from '#imports';
import { useToast } from '~/composables/use-toast';
const { Toast } = useToast();
const appConfig = useAppConfig();

const domain = useState('count', () => process.env.DOMAIN);

function showToast() {
  Toast('toast');
}
</script>

<template>
  <div class="test-page">
    <h1>{{ appConfig.test }}</h1>
    <div>domain: {{ domain }}</div>
    <div @click="showToast">toast</div>
  </div>
</template>

<style lang="scss">
.test-page {
  h1 {
    font-size: 28px;
    display: flex;
  }
}
</style>
