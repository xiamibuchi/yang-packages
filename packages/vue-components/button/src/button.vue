<script lang="ts" setup>
import { computed } from 'vue';
import { useNamespace } from '@syseven/hooks';
import { buttonDefaults } from './button';
import type { ButtonProps } from './button';
import '../style/index';

defineOptions({
  name: 'SyButton',
});

const props = withDefaults(defineProps<ButtonProps>(), buttonDefaults);

const ns = useNamespace('button');
const componentName = ns.b();

const buttonKls = computed(() => {
  const classNames = [componentName];
  if (props.type) {
    classNames.push(ns.m(props.type));
  }
  if (props.size) {
    classNames.push(ns.m(props.size));
  }
  return classNames;
});
</script>

<template>
  <button :class="buttonKls">
    <slot />
  </button>
</template>
