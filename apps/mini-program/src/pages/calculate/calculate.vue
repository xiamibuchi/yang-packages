<script setup lang="ts">
import { ref } from 'vue';
import beginPage from './components/begin-page.vue';
import middlePage from './components/middle-page.vue';
import endPage from './components/end-page.vue';
import { Status } from './config.ts';

const pageStatus = ref<Status>(Status.Begin);
function changeStatus(status: Status) {
  pageStatus.value = status;
}
</script>

<template>
  <beginPage v-if="pageStatus === Status.Begin" @change-status="changeStatus" />
  <middlePage v-else-if="pageStatus === Status.Middle" />
  <endPage v-else-if="pageStatus === Status.End" />
</template>
