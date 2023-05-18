import request from 'axios';

/**
 * 处理 input file change 事件
 * @param {*} e
 * @param {*} callback
 * @returns
 */
export const handleFileChange = (e, callback) => {
  if (e.target.files) {
    return;
  }
  const [file] = e.target.files;
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const file = e.target.result;
    callback(file);
  };
  reader.readAsDataURL(file);
};

export const upload = (file, chunkSize = 1024 * 1024) => {
  const chunks = [];
  let size = 0;
  while (size < file.size) {
    chunks.push(file.slice(size, size + chunkSize));
    size += chunkSize;
  }
  return Promise.all(chunks.map((chunk, index) => uploadChunk(chunk, index)));
};

export const uploadChunk = (chunk, size) => {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('size', size);
  return request({
    url: '/upload',
    method: 'post',
    data: formData,
  });
};
