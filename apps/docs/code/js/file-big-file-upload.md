<script setup>
import BigFileUpload from './components/BigFileUpload.vue'
</script>

# 大文件分片上传

<BigFileUpload />

```ts
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
    })
  );
};

/**
 * 1. 可在 try { uploadFile } 后添加自动重试逻辑
 * 2. index 用来定义分片 hash，可以考虑更换为其他方式
 * 3. 上传进度可以用成功上传的分片个数来计算，否则需要考虑分片上传至 90% 后失败时进度条如何处理
 * 4. 如果考虑限制并发，可以考虑用队列替换 Promise.all
 */
```
