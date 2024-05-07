<template>
  <view class="index">
    <Counter />
    <view>
      <SyRouter :to="Routers.Calculate" replace>Go to Calculate</SyRouter>
    </view>
  </view>
</template>

<script lang="ts">
import './index.scss';
import Counter from '@/components/Counter.vue';
import { Routers } from '@/router/router-config.ts';
import SyRouter from '@/components/SyRouter/SyRouter.vue';

export default {
  name: 'Index',
  components: {
    Counter,
    SyRouter,
  },
  data() {
    return {
      Routers,
    };
  },
};
</script>
