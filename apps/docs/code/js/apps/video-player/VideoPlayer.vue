<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import VideoPlayer from '@syseven/video-player';
import '@syseven/video-player/dist/index.css';

const root = ref<HTMLElement | null>(null);
const levels = [
  {
    uri: 'https://taggy-test.b-cdn.net/test/reolink-original/output.m3u8',
    name: '540p',
    loudness: '-16.543',
  },
  {
    uri: 'https://vjs.zencdn.net/v/oceans.mp4',
    name: '360p',
    loudness: '-16.552',
  },
];
onMounted(() => {
  if (!root.value) {
    return;
  }
  new VideoPlayer({
    el: root.value,
    fillMode: 'auto',
    autoplay: false,
    autoplayMuted: true,
    src: levels[0].uri,
    levels,
    muted: true,
    preload: 'none',
  });
});
</script>

<template>
  <div ref="root">1</div>
</template>
