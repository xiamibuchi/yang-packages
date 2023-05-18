<template>
  <div class="sector-generator">
    <div class="sector-generator__wrap">
      <svg :width="radius * 2" :height="radius * 2">
        <path :d="path" :fill="color" />
      </svg>
    </div>
    <div class="code language-css extra-class">
      <pre class="language-css"><code ref="code"/></pre>
    </div>
    <div class="w-50">
      <span class="key">半径</span>
      <el-slider
        v-model="radius"
        class="slider"
        :min="20"
        :max="150"
        show-input
        input-size="small"
      />
    </div>
    <div class="w-50">
      <span class="key">角度</span>
      <el-slider
        v-model="deg"
        class="slider"
        :min="1"
        :max="359"
        show-input
        input-size="small"
      />
    </div>
    <div class="w-50">
      <span class="key">起始角度</span>
      <el-slider
        v-model="startAngle"
        class="slider"
        :min="0"
        :max="360"
        show-input
        input-size="small"
      />
    </div>
    <div class="w-50">
      <span class="key">颜色</span>
      <div class="block">
        <el-color-picker v-model="color" />
      </div>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js/lib/core';
import html from 'highlight.js/lib/languages/vbscript-html';
import 'highlight.js/styles/pojoaque.css';
hljs.registerLanguage('html', html);
export default {
  name: 'SectorSvg',
  data() {
    return {
      radius: 100,
      deg: 30,
      startAngle: 0,
      color: '#00adb5',
    };
  },
  computed: {
    path() {
      const cx = this.radius;
      const cy = this.radius;
      const radius = this.radius;
      const startAngle = this.startAngle;
      const endAngle = this.startAngle + this.deg;

      const start = this.polarToCartesian(cx, cy, radius, endAngle);
      const end = this.polarToCartesian(cx, cy, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

      return [
        'M',
        start.x,
        start.y,
        'A',
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
        'L',
        cx,
        cy,
        'Z',
      ].join(' ');
    },
  },
  watch: {
    path() {
      this.setCode();
    },
  },
  mounted() {
    setTimeout(() => {
      this.setCode();
    });
  },
  methods: {
    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

      return {
        x: (centerX + radius * Math.cos(angleInRadians)).toFixed(2),
        y: (centerY + radius * Math.sin(angleInRadians)).toFixed(2),
      };
    },
    setCode() {
      const html = `<svg width="${this.radius * 2}" :height="${
        this.radius * 2
      }">
  <path d="${this.path}" fill="${this.color}"></path>
</svg>`;
      // const code = Prism.highlight(html, Prism.languages.html);
      const code = hljs.highlight(html, {
        language: 'html',
      }).value;
      this.$refs['code'].innerHTML = code;
    },
  },
};
</script>

<style lang="scss" scoped>
.sector-generator {
  padding: 15px 0;
  &::after {
    content: '';
    display: block;
    clear: both;
  }
  .sector-generator__wrap {
    height: 300px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .w-50 {
    width: 48%;
    float: left;
    &:nth-of-type(even) {
      float: right;
    }
  }
}
</style>
