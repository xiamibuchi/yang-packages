<script setup lang="ts">
import { ref } from 'vue';
import { read, utils, writeFile } from 'xlsx';

type DataItem = {
  number: number;
};

const data = ref([
  { number: 1 },
  { number: 2 },
  { number: 3 },
  { number: 4 },
] as DataItem[]);
const getRemoteData = async () => {
  const file = await (await fetch('/docs/demo.xlsx')).arrayBuffer();
  const wb = read(file);
  const remoteData: DataItem[] = utils.sheet_to_json(
    wb.Sheets[wb.SheetNames[0]],
  );
  if (Array.isArray(remoteData)) {
    data.value.push(...remoteData);
  }
};

const downloadExcel = () => {
  const workbook = utils.book_new();
  const worksheet = utils.json_to_sheet(data.value);
  utils.book_append_sheet(workbook, worksheet, 'ShenYang');
  writeFile(workbook, 'res.xlsx');
};
</script>

<template>
  <div class="file-excel">
    <el-button type="primary" @click="getRemoteData"> 获取远程数据 </el-button>
    <el-button type="primary" @click="downloadExcel"> 下载 excel </el-button>
    <el-table class="file-excel__table" :data="data">
      <el-table-column prop="number" label="序号" />
    </el-table>
  </div>
</template>

<style lang="scss">
#app .file-excel {
  .el-table__header,
  .el-table__body {
    margin: 0;
    table-layout: fixed;
    border-collapse: separate;
  }
}
.file-excel__table {
  margin-top: 20px;
}
</style>
