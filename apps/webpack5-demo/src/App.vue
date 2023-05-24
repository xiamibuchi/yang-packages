<script lang="ts" setup>
const txt = 'Hello World';
</script>

<template>
  <div>{{ txt }}</div>
  <img class="demo-svg" src="@/demo.svg" alt="" />
</template>

<style lang="scss">
.demo-svg {
  width: 50px;
  height: 50px;
}
</style>
