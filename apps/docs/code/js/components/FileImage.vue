<script setup lang="ts">
import { downloadBlob, downloadImage } from '@syseven/utils';
const download = () => {
  downloadImage('/yang-packages/logo.png', 'shen.png');
};

const downloadSvg = () => {
  downloadBlob('/yang-packages/logo.svg', 'shen.svg');
};
</script>

<template>
  <div>
    <el-button type="primary" @click="download">下载图片</el-button>
    <el-button type="primary" @click="downloadSvg">下载 svg</el-button>
  </div>
</template>
