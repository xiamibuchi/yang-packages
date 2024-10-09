<template>
  <button :class="buttonKls">
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useNamespace } from '@syseven/hooks';
import { buttonPropsDefault, type buttonPropsType } from './button';
// style
import '../style/index';

const props = withDefaults(defineProps<buttonPropsType>(), buttonPropsDefault);

const ns = useNamespace('button');
const componentName = ns.b();

defineOptions({
  name: 'SyButton',
});

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
