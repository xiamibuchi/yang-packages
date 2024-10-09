<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError,
});
const dev = import.meta.dev;
</script>

<template>
  <div>
    <h1>{{ props.error?.statusCode }}</h1>
    <div
      v-if="dev && error?.message"
      class="error-message"
      v-html="error.message"
    />
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>
