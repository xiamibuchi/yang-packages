<template>
  <component :is="tag">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { textProps } from './text';

defineOptions({
  name: 'ElText',
});

defineProps(textProps);
</script>
