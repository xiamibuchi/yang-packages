<template>
  <div class="polygon-layout">
    <div class="polygon-layout-container">
      <div class="circle" />
      <div class="polygon-layout__content">
        <div
          v-for="(item, index) in position"
          :key="index"
          class="polygon-layout-item"
          :style="{ left: `${item.left}px`, top: `${item.top}px` }"
        >
          item-{{ index + 1 }}
        </div>
      </div>
    </div>

    <div class="key-value">
      <span class="key">选择边数:</span>
      <el-radio
        v-for="i in [3, 4, 5, 6, 7, 8]"
        :key="i"
        v-model="num"
        :label="i"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: 3,
    };
  },
  computed: {
    position() {
      return this.setPolygonLayout(this.num, 160, {
        width: 60,
        height: 60,
      });
    },
  },
  methods: {
    setPolygonLayout(
      num,
      radius,
      itemSize = {
        width: 0,
        height: 0,
      }
    ) {
      if (num < 3) {
        return;
      }

      const startAngle = num % 2 === 1 ? 0 : (2 * Math.PI) / num / 2;
      const position = [];

      for (let i = 0; i < num; i++) {
        const angle = (i * 2 * Math.PI) / num + startAngle;
        position.push({
          top: -radius * Math.cos(angle) - itemSize.height / 2,
          left: -radius * Math.sin(angle) - itemSize.width / 2,
        });
      }

      return position;
    },
  },
};
</script>

<style lang="scss">
.polygon-layout {
  .circle {
    width: 320px;
    height: 320px;
    border-radius: 50%;
    border: 1px solid #ddd;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .polygon-layout-container {
    width: 320px;
    height: 450px;
    margin: 0 auto;
    position: relative;
    .polygon-layout__content {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      .polygon-layout-item {
        width: 60px;
        height: 60px;
        background: #00adb5;
        border-radius: 50%;
        text-align: center;
        line-height: 60px;
        color: #fff;
        position: absolute;
      }
    }
  }
  .key-value {
    .key {
      width: 120px;
    }
    .key-value--item:not(:last-of-type) {
      border-right: 2px solid #ccc;
      padding-right: 10px;
      margin-right: 10px;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }
}
</style>
