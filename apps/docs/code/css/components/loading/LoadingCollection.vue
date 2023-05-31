<script lang="ts" setup>
import LoadingCircle from './LoadingCircle.vue';
import LoadingSvgCircle from './LoadingSvgCircle.vue';
import LoadingBox from './LoadingBox.vue';
import load1 from './load1.vue';
import load2 from './load2.vue';
import load3 from './load3.vue';
import load4 from './load4.vue';
import load5 from './load5.vue';
import load6 from './load6.vue';
import load7 from './load7.vue';
</script>

<template>
  <div class="loading-collection">
    <div class="flex-center">
      <LoadingCircle />
    </div>
    <div class="flex-center">
      <LoadingSvgCircle />
    </div>
    <div class="flex-center">
      <LoadingBox />
    </div>
    <div class="flex-center">
      <load1 />
    </div>
    <div class="flex-center">
      <load2 />
    </div>
    <div class="flex-center">
      <load3 />
    </div>
    <div class="flex-center">
      <load4 />
    </div>
    <div class="flex-center">
      <load5 />
    </div>
    <div class="flex-center">
      <load6 />
    </div>
    <div class="flex-center">
      <load7 />
    </div>
  </div>
</template>

<style>
.loading-collection {
  margin: 20px auto 0;
  display: grid;
  max-width: 768px;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2em;
  grid-auto-rows: 128px;
}
</style>
