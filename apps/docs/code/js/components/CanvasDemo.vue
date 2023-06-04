<script lang="ts" setup>
import { onMounted } from 'vue';

onMounted(() => {
  const canvas = document.getElementById('canvas-demo') as HTMLCanvasElement;
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.moveTo(50, 50);
  ctx.lineTo(200, 200);
  ctx.lineTo(200, 50);
  ctx.lineTo(50, 50);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  // 矩形
  ctx.strokeRect(50, 50, 200, 100);
  // 实心矩形
  ctx.fillRect(0, 0, 50, 50);
  // 清空区域
  ctx.clearRect(15, 15, 20, 20);
  ctx.stroke();
  // 圆弧
  ctx.arc(60, 60, 50, 0, Math.PI * 2, false);
  ctx.stroke();
  // 椭圆
  ctx.ellipse(50, 250, 50, 100, 0, 0, 2 * Math.PI);
  ctx.stroke();
  // 二次贝塞尔曲线
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(150, 150, 350, 50);
  ctx.stroke();
});
</script>

<template>
  <canvas id="canvas-demo" width="200" height="500" />
</template>

<style scoped lang="scss"></style>
