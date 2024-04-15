<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAppConfig, useState } from '#imports';

import { useToast } from '~/composables/use-toast';
const { Toast } = useToast();
const { t } = useI18n();
const appConfig = useAppConfig();

const domain = useState('count', () => process.env.DOMAIN);

function showToast() {
  Toast('toast');
}
</script>

<template>
  <div class="test-page">
    <h1>{{ appConfig.test }}</h1>
    <div>多语言：{{ t('_test') }}</div>
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
