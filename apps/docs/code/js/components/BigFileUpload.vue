<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { reactive, ref } from 'vue';
// api
import { SyButton } from '@syseven/vue-components';
import { checkFile, mergeChunk, uploadFile } from './upload';
// component

const CHUNK_SIZE_LIMIT = 1024 * 1024 * 2; // 2M
const uploadFileList = ref<any[]>([]);
const maxRequest = ref(6);
const uploadInputRef = ref<HTMLInputElement | null>(null);

enum UploadState {
  NOTHING = 0, // 什么都不做
  PROCESSING = 1, // 文件处理中
  UPLOADING = 2, // 上传中
  PAUSED = 3, // 暂停
  FINISHED = 4, // 上传完成
  INTERRUPTED = 5, // 上传中断
  FAILED = 6, // 上传失败
}

interface UploadItem {
  id: number;
  state: UploadState;
  fileHash: string;
  fileName: string;
  fileSize: number;
  allChunkList: {
    fileHash: string;
    fileSize: number;
    fileName: string;
    index: number;
    chunkFile: Blob;
    chunkHash: string;
    CHUNK_SIZE_LIMIT: number;
    chunkNumber: number;
    finish: boolean;
    cancel: (() => void) | null;
  }[];
  whileRequests: {
    fileHash: string;
    fileSize: number;
    fileName: string;
    index: number;
    chunkFile: Blob;
    chunkHash: string;
    CHUNK_SIZE_LIMIT: number;
    chunkNumber: number;
    finish: boolean;
    cancel: (() => void) | null;
  }[];
  finishNumber: number;
  errNumber: number;
  percentage: number;
  cancel: (() => void) | null;
}

/**
 * @description 生成文件 hash（web-worker）
 */
const useWorker = (
  file: File,
): Promise<{
  fileHash: string;
  fileChunkList: {
    chunkFile: Blob;
    chunkHash: string;
  }[];
}> => {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.postMessage({ file, CHUNK_SIZE_LIMIT });
    worker.onmessage = (e) => {
      const { fileHash, fileChunkList } = e.data;
      if (fileHash) {
        resolve({
          fileHash,
          fileChunkList,
        });
      }
    };
  });
};

// 暂停上传（是暂停剩下未上传的）
const pauseUpload = (taskArrItem: UploadItem, elsePause = true) => {
  // elsePause 为 true 就是主动暂停，为false就是请求中断
  // 4 是成功 6 是失败  如果不是成功或者失败状态，
  if (![UploadState.FINISHED, UploadState.FAILED].includes(taskArrItem.state)) {
    // 3是暂停，5是中断
    if (elsePause) {
      taskArrItem.state = UploadState.PAUSED;
    } else {
      taskArrItem.state = UploadState.INTERRUPTED;
    }
  }
  taskArrItem.errNumber = 0;

  // 取消还在请求中的所有接口
  if (taskArrItem.whileRequests.length > 0) {
    for (const itemB of taskArrItem.whileRequests) {
      itemB.cancel ? itemB.cancel() : '';
    }
  }
  // // 所有剩下的请求都触发取消请求
  // for (const itemB of item.allChunkList) {
  //   //  如果cancel是函数则触发取消函数
  //   itemB.cancel ? itemB.cancel() : ''
  // }
};

/**
 * @description 恢复上传
 */
const resumeUpload = (taskArrItem: UploadItem) => {
  taskArrItem.state = UploadState.UPLOADING;
  // 把刚才暂停的正在上传中所有切片放到待上传切片列表中
  taskArrItem.allChunkList.push(...taskArrItem.whileRequests);
  taskArrItem.whileRequests = [];
  uploadSignleFile(taskArrItem);
};

// 取消单个
const cancelSingle = async (taskArrItem) => {
  pauseUpload(taskArrItem);
  // 取消上传后列表删除该文件
  uploadFileList.value = uploadFileList.value.filter(
    (itemB) => itemB.fileHash !== taskArrItem.fileHash,
  );
};

// 全部取消
const cancelAll = () => {
  for (const item of uploadFileList.value) {
    pauseUpload(item);
  }

  uploadFileList.value = [];
};

// 调取合并接口处理所有切片
const handleMerge = async (taskArrItem: UploadItem) => {
  const { fileName, fileHash } = taskArrItem;
  const res = await mergeChunk({
    CHUNK_SIZE_LIMIT,
    fileName,
    fileHash,
  }).catch(() => {});
  //  如果合并成功则标识该文件已经上传完成
  if (res && res.code === 0) {
    // 设置文件上传状态
    finishTask(taskArrItem);
    console.log('文件合并成功！');
  } else {
    // 否则暂停上传该文件
    pauseUpload(taskArrItem, true);
    console.log('文件合并失败！');
  }
  // 最后赋值文件切片上传完成个数为0
  taskArrItem.finishNumber = 0;
};

// 更新单个文件进度条
const signleFileProgress = (needObj, taskArrItem) => {
  // 即使是超时请求也是会频繁的返回上传进度的,所以只能写成完成一片就添加它所占百分之多少,否则会造成误会
  taskArrItem.percentage = Number(
    ((taskArrItem.finishNumber / needObj.chunkNumber) * 100).toFixed(2),
  );
};

// 设置单个文件上传已完成
const finishTask = (item) => {
  item.percentage = 100;
  // 4是上传完成
  item.state = UploadState.FINISHED;
};

// 单个文件上传
const uploadSignleFile = (taskArrItem) => {
  // 如果没有需要上传的切片 / 正在上传的切片还没传完，就不做处理
  if (
    taskArrItem.allChunkList.length === 0 ||
    taskArrItem.whileRequests.length > 0
  ) {
    return false;
  }
  // 找到文件处于处理中/上传中的 文件列表（是文件而不是切片）
  const isTaskArrIng = uploadFileList.value.filter(
    (itemB) =>
      itemB.state === UploadState.PROCESSING ||
      itemB.state === UploadState.UPLOADING,
  );

  // 实时动态获取并发请求数,每次调请求前都获取一次最大并发数
  // 浏览器同域名同一时间请求的最大并发数限制为6
  // 例如如果有3个文件同时上传/处理中，则每个文件切片接口最多调 6 / 3 == 2个相同的接口
  maxRequest.value = Math.ceil(6 / isTaskArrIng.length);

  // 从数组的末尾开始提取 maxRequest 个元素。
  const whileRequest = taskArrItem.allChunkList.slice(-maxRequest.value);

  // 设置正在请求中的个数
  taskArrItem.whileRequests.push(...whileRequest);
  //  如果总请求数大于并发数
  if (taskArrItem.allChunkList.length > maxRequest.value) {
    // 则减去并发数
    taskArrItem.allChunkList.splice(-maxRequest.value);
  } else {
    // 否则总请求数置空,说明已经把没请求的全部放进请求列表了，不需要做过多请求
    taskArrItem.allChunkList = [];
  }

  // 单个分片请求
  const uploadChunk = async (needObj) => {
    const fd = new FormData();
    const {
      fileHash,
      fileSize,
      fileName,
      index,
      chunkFile,
      chunkHash,
      CHUNK_SIZE_LIMIT,
      chunkNumber,
    } = needObj;

    fd.append('fileHash', fileHash);
    fd.append('fileSize', String(fileSize));
    fd.append('fileName', fileName);
    fd.append('index', String(index));
    fd.append('chunkFile', chunkFile);
    fd.append('chunkHash', chunkHash);
    fd.append('CHUNK_SIZE_LIMIT', String(CHUNK_SIZE_LIMIT));
    fd.append('chunkNumber', String(chunkNumber));
    // @ts-ignore
    const res = await uploadFile(fd, (onCancelFunc) => {
      // 在调用接口的同时，相当于同时调用了传入的这个函数，又能同时拿到返回的取消方法去赋值
      needObj.cancel = onCancelFunc;
    }).catch(() => {});
    // 先判断是不是处于暂停还是取消状态
    // 你的状态都已经变成暂停或者中断了,就什么都不要再做了,及时停止
    if (
      taskArrItem.state === UploadState.PAUSED ||
      taskArrItem.state === UploadState.INTERRUPTED
    ) {
      return false;
    }

    // 请求异常,或者请求成功服务端返回报错都按单片上传失败逻辑处理,.then.catch的.catch是只能捕捉请求异常的
    if (!res || res.code === -1) {
      taskArrItem.errNumber++;
      // 超过3次之后直接上传中断
      if (taskArrItem.errNumber > 3) {
        console.log('切片上传失败超过三次了');
        pauseUpload(taskArrItem, false); // 上传中断
      } else {
        console.log('切片上传失败还没超过3次');
        uploadChunk(needObj); // 失败了一片,继续当前分片请求
      }
    } else if (res.code === 0) {
      // 单个文件上传失败次数大于0则要减少一个
      taskArrItem.errNumber > 0 ? taskArrItem.errNumber-- : 0;
      // 单个文件切片上传成功数+1
      taskArrItem.finishNumber++;
      // 单个切片上传完成
      needObj.finish = true;
      signleFileProgress(needObj, taskArrItem); // 更新进度条
      // 上传成功了就删掉请求中数组中的那一片请求
      taskArrItem.whileRequests = taskArrItem.whileRequests.filter(
        (item) => item.chunkFile !== needObj.chunkFile,
      );

      // 如果单个文件最终成功数等于切片个数
      if (taskArrItem.finishNumber === chunkNumber) {
        // 全部上传完切片后就开始合并切片
        handleMerge(taskArrItem);
      } else {
        // 如果还没完全上传完，则继续上传
        uploadSignleFile(taskArrItem);
      }
    }
  };

  // 开始单个上传
  for (const item of whileRequest) {
    uploadChunk(item);
  }
};

// 输入框change事件
type FileEvent = Event & {
  target: {
    files: File[];
  };
};
const onUploadFile = async (e: Event) => {
  if (!uploadInputRef.value) {
    return false;
  }
  const fileEl = e.target as FileEvent['target'];
  console.log(fileEl.files, 'fileEl');
  const file = fileEl?.files?.[0];
  if (!file) {
    return false;
  }
  // 单个上传文件
  // 这里要注意vue2跟vue3不同，
  // 如果在循环 + await中，如果把一个普通对象push进一个响应式数组
  // 直接修改原对象可能不会触发vue的DOM视图更新（但最终值会改变）
  // 所以这里用了reactive做响应式代理
  const inTaskArrItem = reactive({
    id: Date.now(), // 因为forEach是同步，所以需要用指定id作为唯一标识
    state: UploadState.NOTHING,
    fileHash: '',
    fileName: file.name,
    fileSize: file.size,
    allChunkList: [] as any[], // 所有请求的数据
    whileRequests: [], // 正在请求中的请求个数,目前是要永远都保存请求个数为6
    finishNumber: 0, //请求完成的个数
    errNumber: 0, // 报错的个数,默认是0个,超多3个就是直接上传中断
    percentage: 0, // 单个文件上传进度条
    cancel: null, // 用于取消切片上传接口
  });
  uploadFileList.value.push(inTaskArrItem);
  // 如果不使用reactive，就得使用以下两种方式
  // inTaskArrItem = uploadFileList.value[i]
  // uploadFileList.value[i].state = 2
  // 开始处理解析文件
  inTaskArrItem.state = UploadState.PROCESSING;

  if (file.size === 0) {
    // 文件大小为0直接上传失败
    inTaskArrItem.state = UploadState.FAILED;
    // 上传中断
    pauseUpload(inTaskArrItem, false);
  }
  console.log('开始解析文件');
  const { fileHash, fileChunkList } = await useWorker(file);
  console.log(`文件 hash 计算完成：${fileHash}`);

  // 解析完成开始上传文件
  let baseName = '';
  // 查找'.'在fileName中最后出现的位置
  const lastIndex = file.name.lastIndexOf('.');
  // 如果'.'不存在，则返回整个文件名
  if (lastIndex === -1) {
    baseName = file.name;
  }
  baseName = file.name.slice(0, lastIndex);
  // 这里要注意！可能同一个文件，是复制出来的，出现文件名不同但是内容相同，导致获取到的hash值也是相同的
  // 所以文件hash要特殊处理
  inTaskArrItem.fileHash = `${fileHash}${baseName}`;
  inTaskArrItem.state = UploadState.UPLOADING;
  console.log('uploadFileList.value', uploadFileList.value);
  // 上传之前要检查服务器是否存在该文件
  try {
    const res = await checkFile({
      fileHash: `${fileHash}${baseName}`,
      fileName: file.name,
    });
    if (res.code === 0) {
      const { shouldUpload, uploadedList } = res.data;
      if (!shouldUpload) {
        finishTask(inTaskArrItem);
        console.log('已经上传过了');
        return false;
      }

      inTaskArrItem.allChunkList = fileChunkList.map((item, index) => {
        return {
          // 总文件hash
          fileHash: `${fileHash}${baseName}`,
          // 总文件size
          fileSize: file.size,
          // 总文件name
          fileName: file.name,
          index,
          // 切片文件本身
          chunkFile: item.chunkFile,
          // 单个切片hash,以 - 连接
          chunkHash: `${fileHash}-${index}`,
          // 切片文件大小
          CHUNK_SIZE_LIMIT,
          // 切片个数
          chunkNumber: fileChunkList.length,
          // 切片是否已经完成
          finish: false,
        };
      });

      // 如果已存在部分文件切片，则要过滤调已经上传的切片
      if (uploadedList.length > 0) {
        // 过滤掉已经上传过的切片
        inTaskArrItem.allChunkList = inTaskArrItem.allChunkList.filter(
          (item) => !uploadedList.includes(item.chunkHash),
        );

        // 如果存在需要上传的，但是又为空，可能是因为还没合并，
        if (!inTaskArrItem.allChunkList.length) {
          // 所以需要调用合并接口
          await handleMerge(inTaskArrItem);
          return false;
        } else {
          // 同时要注意处理切片数量
          inTaskArrItem.allChunkList = inTaskArrItem.allChunkList.map(
            (item) => {
              return {
                ...item,
                chunkNumber: inTaskArrItem.allChunkList.length,
              };
            },
          );
        }
      }
      // 逐步对单个文件进行切片上传
      uploadSignleFile(inTaskArrItem);
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div>1</div>
  <div v-for="(item, idx) in uploadFileList" :key="idx">
    {{ item?.file?.name }}
  </div>
  <div class="upload-btn__wrap">
    <SyButton type="primary" class="upload-btn">
      选择文件上传
      <input
        ref="uploadInputRef"
        type="file"
        class="upload-input"
        @change="onUploadFile"
      />
    </SyButton>
  </div>
</template>

<style lang="scss" scoped>
.upload-btn__wrap {
  display: flex;
  align-items: center;
}
.upload-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>
