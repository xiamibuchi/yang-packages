<script setup lang="ts">
import { ref } from 'vue';
import { downloadAnchor } from '@syseven/utils';

type DataItem = {
  number: number;
  name: string;
  [key: string]: unknown;
};

const data = ref([
  { number: 1, name: 'a' },
  { number: 2, name: 'b' },
  { number: 3, name: 'c' },
  { number: 4, name: 'd' },
] as DataItem[]);

const downloadCsv = () => {
  const HEADERS = ['number', 'name'];
  const CSV_HEADER = `${HEADERS.join(',')}\n`;
  const CSV_BODY = data.value.reduce((result, ele) => {
    const line = HEADERS.reduce((str, key, i) => {
      str += ele?.[key] || '';
      if (i < HEADERS.length - 1) {
        str += ',\t';
      }
      return str;
    }, '');
    result += `${line}\n`;
    return result;
  }, '');
  const CSV_STR = `${CSV_HEADER}${CSV_BODY}`;
  const BLOB = new Blob([CSV_STR], { type: 'text/csv;charset=utf-8' });
  const URL = window.URL.createObjectURL(BLOB);
  downloadAnchor(URL, 'res.csv');
  window.URL.revokeObjectURL(URL);
};
</script>

<template>
  <div class="file-excel">
    <el-button type="primary" @click="downloadCsv">下载 csv</el-button>
    <el-table class="file-excel__table" :data="data">
      <el-table-column prop="number" label="序号" />
      <el-table-column prop="name" label="名称" />
    </el-table>
  </div>
</template>

<style lang="scss">
.file-excel__table {
  margin-top: 20px;
}
</style>
