<template>
  <component :is="tag">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { textProps } from './text';
defineOptions({
  name: 'SyText',
});
defineProps(textProps);
</script>
