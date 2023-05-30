<script setup lang="ts">
// 下载图片
const downloadImage = () => {
  const LINK = document.createElement('a') as HTMLAnchorElement | null;
  if (!LINK) {
    return;
  }
  LINK.href = '/docs/images/beian.png';
  LINK.download = 'beian.png';
  LINK.click();
  LINK.remove();
};
</script>

<template>
  <el-button type="primary" @click="downloadImage">下载图片</el-button>
</template>
