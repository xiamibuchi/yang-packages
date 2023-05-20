<template>
  <component :is="tag" :class="textKls" :style="textStyle">
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

const textStyle = computed(() => {
  if (!props.rows || props.rows <= 1) {
    return null;
  }
  return {
    '-webkit-line-clamp': props.rows,
  };
});

const textKls = computed(() => {
  const classNames = [ns.b()];
  if (props.rows) {
    const modifyClassName = ns.m(`ellipsis${props.rows > 1 ? `-mutiple` : ''}`);
    classNames.push(modifyClassName);
  }
  return classNames;
});
</script>
