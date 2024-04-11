<script setup lang="ts">
import { useAppConfig, useState } from '#imports';
const appConfig = useAppConfig();

const domain = useState('count', () => process.env.DOMAIN);
</script>

<template>
  <div class="test-page">
    <h1>{{ appConfig.test }}</h1>
    <div>domain: {{ domain }}</div>
  </div>
</template>

<style lang="scss"></style>
