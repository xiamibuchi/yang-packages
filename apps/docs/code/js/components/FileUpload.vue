<script lang="ts" setup>
const CHUNK_SIZE = 5 * 1024 * 1024;
const uploadedChunks: number[] = []; // 已上传的分块
let totalChunks = 0; // 总分块数

const request: any = () => {
  // 业务请求
};

const uploadChunk = (file: File, chunk: Blob, index: number) => {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('index', index.toString());
  formData.append('total', totalChunks.toString());
  formData.append('name', file.name);
  formData.append('type', file.type);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return request('/upload', formData, config);
};

const chunk = (file: File) => {
  const chunks: Blob[] = [];
  let start = 0;
  let end = 0;
  while (start < file.size) {
    end = Math.min(start + CHUNK_SIZE, file.size);
    chunks.push(file.slice(start, end));
    start = end;
  }
  totalChunks = chunks.length;
  return chunks;
};

const uploadFile = async (file: File) => {
  const chunks = chunk(file);
  await Promise.all(
    chunks.map(async (chunk, index) => {
      if (!uploadedChunks.includes(index)) {
        try {
          await uploadChunk(file, chunk, index);
          uploadedChunks.push(index);
        } catch (e) {
          console.error(e);
        }
      }
    }),
  );
  if (uploadedChunks.length <= totalChunks) {
    await merge(file);
  }
};

const merge = async (file: File) => {
  const formData = new FormData();
  formData.append('name', file.name);
  formData.append('type', file.type);
  return request('/merge', formData);
};

const handleFileChange = (e) => {
  if (!e?.target?.files) {
    return;
  }
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  uploadFile(file);
  handleFilePreview(file);
};

const handleFilePreview = (file) => {
  const url = URL.createObjectURL(file);
  window.open(url);
  URL.revokeObjectURL(url);
};
</script>

<template>
  <input type="file" accept="video/*,.pdf" @change="handleFileChange" />
</template>
