<script setup lang="ts">
import { navigateTo, redirectTo } from '@tarojs/taro';

const props = withDefaults(
  defineProps<{
    to: string;
    replace?: boolean;
  }>(),
  {
    to: '',
    replace: false,
  },
);

function onClick() {
  if (props.replace) {
    return redirectTo({ url: props.to });
  }
  return navigateTo({
    url: props.to,
  });
}
</script>

<template>
  <view class="sy-router" @tap="onClick">
    <slot />
  </view>
</template>
