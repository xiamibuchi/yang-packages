<template>
  <component :is="tag" :class="textKls">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useNamespace } from '@syseven/hooks';
import { textProps } from './text';

defineOptions({
  name: 'SyText',
});

const props = defineProps(textProps);

const ns = useNamespace('text');

const textKls = computed(() => [ns.b(), ns.m(`ellipsis-${props.rows}`)]);
</script>
