<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import VideoPlayer from '@syseven/video-player';

const root = ref<HTMLElement | null>(null);
const levels = [
  {
    uri: 'https://vjs.zencdn.net/v/oceans.mp4',
    name: 'oceans',
    loudness: '-16.552',
  },
  {
    uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    name: 'x36xhzz',
    loudness: '-16.543',
  },
  {
    uri: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_adv_example_hevc/master.m3u8',
    name: 'subtitle',
  },
];
onMounted(() => {
  if (!root.value) {
    return;
  }
  const player = new VideoPlayer({
    el: root.value,
    isLive: false,
    fillMode: 'auto',
    loop: true,
    autoplay: false,
    autoplayMuted: true,
    src: levels[1].uri,
    levels,
    muted: true,
    preload: 'none',
  });
  player.sendDanmaku({
    text: '测试弹幕',
    color: 'red',
  });
});
</script>

<template>
  <div ref="root" />
</template>
