<template>
  <web-view :src="url" />
</template>

<script>
import { setNavigationBarTitle } from '@tarojs/taro';
export default {
  data() {
    return {
      url: '',
    };
  },
  onLoad(options) {
    this.url = decodeURIComponent(options.url || '');

    if (options.title) {
      setNavigationBarTitle({
        title: decodeURIComponent(options.title || ''),
      });
    }
  },
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
  onShareTimeline() {},
};
</script>
