import service from './request';

/**
 * @description 上传切片
 * @param fileHash 文件hash，String
 * @param fileSize 文件大小，Number
 * @param fileName 文件名称，String
 * @param index 多文件上传中的所在index，number
 * @param chunkFile 切片文件本身，File || Blob || void
 * @param chunkHash 切片文件hash，String
 * @param chunkSize 分片大小，Number
 * @param chunkNumber 切片总数量，Number
 * @param finish 是否上传完成，可选参数，Boolean
 * @returns 返回值描述（如果有的话）
 */
export function uploadFile(data): Promise<{
  code: number;
  data?: any;
  message?: string;
}> {
  // 封装 axios 请求或 HTTP 客户端请求
  return service({
    url: '/upload',
    method: 'post',
    data,
  });
}

/**
 * @description 合并切片
 * @param chunkSize 分片大小，Number
 * @param fileName 文件名称，String
 * @param fileSize 文件大小，Number
 */
export function mergeChunk(data): Promise<{
  code: number;
  data?: any;
  message?: string;
}> {
  return service({
    url: '/merge',
    method: 'post',
    data,
  });
}

/**
 * @description 检查文件是否存在
 * @param fileHash 文件hash
 * @param fileName 文件名称
 */
export function checkFile(data: {
  fileHash: string;
  fileName: string;
}): Promise<{
  code: number;
  data?: any;
  message?: string;
}> {
  return service({
    url: '/verify',
    method: 'post',
    data,
  });
}
