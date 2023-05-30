<script setup lang="ts">
import { downloadBlob, downloadImage } from '@syseven/utils';
const download = () => {
  downloadImage('/docs/images/logo.png', 'shen.png');
};

const downloadSvg = () => {
  downloadBlob('/docs/images/logo.svg', 'shen.svg');
};
</script>

<template>
  <div>
    <el-button type="primary" @click="download">下载图片</el-button>
    <el-button type="primary" @click="downloadSvg">下载 svg</el-button>
  </div>
</template>
