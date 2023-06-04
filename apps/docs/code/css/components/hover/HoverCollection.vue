<script lang="ts" setup>
import hover1 from './hover1.vue';
import hover2 from './hover2.vue';
import hover3 from './hover3.vue';
import hover4 from './hover4.vue';
import hover5 from './hover5.vue';
import hover6 from './hover6.vue';
import hover7 from './hover7.vue';
</script>

<template>
  <div class="hover-collection">
    <div class="flex-center">
      <hover1 />
    </div>
    <div class="flex-center">
      <hover2 />
    </div>
    <div class="flex-center">
      <hover3 />
    </div>
    <div class="flex-center">
      <hover4 />
    </div>
    <div class="flex-center">
      <hover5 />
    </div>
    <div class="flex-center">
      <hover6 />
    </div>
    <div class="flex-center">
      <hover7 />
    </div>
  </div>
</template>

<style>
.hover-collection {
  margin: 20px auto 0;
  display: grid;
  max-width: 768px;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2em;
  grid-auto-rows: 128px;
}
</style>
