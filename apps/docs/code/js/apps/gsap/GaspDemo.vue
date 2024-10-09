<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
const trigger = ref<Element | null>(null);
onMounted(() => {
  // gsap.from('.line-ele', {
  //   scrollTrigger: {
  //     trigger: '.line',
  //     scrub: true,
  //     start: '-200',
  //     end: 'bottom bottom',
  //     markers: true,
  //   },
  //   height: '200px',
  //   opacity: 0,
  //   transformOrigin: 'left center',
  //   ease: 'none',
  // });

  ScrollTrigger.create({
    trigger: '.line-ele',
    scrub: true,
    start: 'top center',
    end: 'bottom center',
    markers: true,
    onEnter: () => {
      console.log('enter');
      gsap.to(trigger.value, { opacity: 0, duration: 1 });
    },
    onLeave: () => {
      console.log('leave');
      gsap.to(trigger.value, { opacity: 1, duration: 1 });
    },
    onEnterBack: () => {
      console.log('enter back');
      gsap.to(trigger.value, { opacity: 0, duration: 1 });
    },
    onLeaveBack: () => {
      console.log('leave back');
      gsap.to(trigger.value, { opacity: 1, duration: 1 });
    },
  });
});

onBeforeUnmount(() => {
  gsap.killTweensOf('.line-ele');
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill();
  });
});
</script>

<template>
  <div style="height: 100vh" />
  <div ref="trigger" class="line-ele" />
  <div style="height: 100vh; background-color: blue" />
</template>

<style lang="scss" scoped>
.line-ele {
  width: 50px;
  height: 200px;
  margin: 0 0 10px 0;
  position: relative;
  display: block;
  background-color: red;
  opacity: 1;
}
</style>
