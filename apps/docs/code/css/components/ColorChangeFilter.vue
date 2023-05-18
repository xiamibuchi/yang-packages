<template>
  <div>
    <p>支持任意格式色值，包括颜色关键字。</p>
    <el-form id="form" class="filter-form" label-width="100px">
      <el-form-item label="原始色">
        <el-input
          id="start"
          ref="start"
          v-model.trim="startColor"
          placeholder="原始色值"
          name="start"
          autocomplete="off"
          autofocus=""
          :style="{
            color: startInputColor,
          }"
          @change="initValue"
        />
      </el-form-item>
      <el-form-item label="目标色">
        <el-input
          id="end"
          ref="end"
          v-model.trim="endColor"
          placeholder="呈现色值"
          name="end"
          autocomplete="off"
          :style="{
            color: endInputColor,
          }"
          @change="initValue"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getFilterRules">转换</el-button>
        <el-button type="primary" @click="autoGetFilterRules"
          >自动转换
        </el-button>
      </el-form-item>
    </el-form>
    <div class="filter-block">
      <div
        id="colorReal"
        class="filter-span"
        :style="{
          background: startInputColor,
        }"
      >
        <span>真背景色</span>
      </div>
      <div id="colorFilter" class="filter-span" :style="filter">
        <span>滤镜呈现</span>
      </div>
    </div>
    <p id="show" class="filter-show">
      {{ filter }}
    </p>
    <p v-show="filter" id="loss-detail" class="filter-loss">
      滤镜色值：{{ filterColor }}，误差：{{ errorValue }}。{{ errorMessage }}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startColor: '#000000',
      endColor: '#ff0033',
      startInputColor: '#000000',
      endInputColor: '#ff0033',
      filterColor: '',
      errorValue: 100,
      errorMessage: '',
      Color: {},
      Solver: {},
      filter: '',
      times: 0,
      timer: null,
    };
  },
  mounted() {
    this.init();
  },
  unmounted() {
    clearInterval(this.timer);
  },
  methods: {
    initValue() {
      this.errorValue = 100;
      this.errorMessage = '';
      this.times = 0;
      clearInterval(this.timer);
    },
    getFilterRules() {
      this.startInputColor = this.startColor;
      this.endInputColor = this.endColor;
      this.$nextTick(this.change);
    },
    autoGetFilterRules() {
      this.times = 0;
      clearInterval(this.timer);
      const timer = setInterval(() => {
        this.times++;
        if (this.times > 100) {
          clearInterval(this.timer);
        }
        this.getFilterRules();
      }, 0);
    },
    change() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      const startDom = this.$refs.start.$el;
      const endDom = this.$refs.end.$el;
      const startColor = this.startColor;
      const endColor = this.endColor;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 10;
      canvas.height = 10;
      // 将输入的颜色转换为rgb格式
      const startRgbColor = window.getComputedStyle(startDom).color;
      const endRgbColor = window.getComputedStyle(endDom).color;
      const startRgbColorList = startRgbColor
        .replace(/\s|[A-Za-z()]/g, '')
        .split(',');
      const endRgbColorList = endRgbColor
        .replace(/\s|[A-Za-z()]/g, '')
        .split(',');
      // 目标颜色对象
      const tagetColor = new self.Color(
        endRgbColorList[0],
        endRgbColorList[1],
        endRgbColorList[2]
      );
      const solver = new self.Solver(tagetColor);
      solver.reusedColor = new self.Color(
        startRgbColorList[0],
        startRgbColorList[1],
        startRgbColorList[2]
      );
      const result = solver.solve();
      colorReal.style.backgroundColor = endColor;
      colorFilter.style.backgroundColor = startColor;
      const img = new Image();
      img.onload = function () {
        context.drawImage(this, 0, 0);
        const imageData = context.getImageData(5, 5, 1, 1);
        const r = imageData.data[0];
        const g = imageData.data[1];
        const b = imageData.data[2];
        const y = Math.sqrt(
          (endRgbColorList[0] - r) * (endRgbColorList[0] - r) +
            (endRgbColorList[1] - g) * (endRgbColorList[1] - g) +
            (endRgbColorList[2] - b) * (endRgbColorList[2] - b)
        );
        let errorMessage = '';
        if (y == 0) {
          errorMessage = '完美！';
        } else if (y < 2) {
          errorMessage = '几乎完美！';
        } else if (y < 5) {
          errorMessage = '颜色很接近了。';
        } else if (y < 15) {
          errorMessage = '颜色有些许出入，试试重新转换下。';
        } else {
          errorMessage = '颜色出入较大，请重新再转一遍。';
        }
        if (self.errorValue > y) {
          self.errorValue = y;
          self.errorMessage = errorMessage;
          self.filterColor = self.colorHex(`rgb(${[r, g, b].join()})`);
          // 生成的 filter
          self.filter = result.filter;
        }
      };
      img.src = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><foreignObject width="10" height="10"><body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;width:10px;height:10px;background-color:${startColor.replace(
        '#',
        '%23'
      )};${result.filter}"></body></foreignObject></svg>`;
    },
    colorHex(rgbColor) {
      const h = rgbColor;
      const f = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      if (/^(rgb|RGB)/.test(h)) {
        const b = h.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
        let a = '#';
        for (let c = 0; c < b.length; c++) {
          let g = Number(b[c]).toString(16);
          if (g.length < 2) {
            g = `0${g}`;
          }
          a += g;
        }
        if (a.length !== 7) {
          a = h;
        }
        return a;
      } else {
        if (f.test(h)) {
          const e = h.replace(/#/, '').split('');
          if (e.length === 6) {
            return h;
          } else {
            if (e.length === 3) {
              let d = '#';
              for (let c = 0; c < e.length; c += 1) {
                d += e[c] + e[c];
              }
              return d;
            }
          }
        }
      }
      return h;
    },
    init() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      this.Color = class Color {
        constructor(r, g, b) {
          this.set(r, g, b);
        }
        toString() {
          return `rgb(${Math.round(this.r)}, ${Math.round(
            this.g
          )}, ${Math.round(this.b)})`;
        }

        set(r, g, b) {
          this.r = this.clamp(r);
          this.g = this.clamp(g);
          this.b = this.clamp(b);
        }

        hueRotate(angle = 0) {
          angle = (angle / 180) * Math.PI;
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          this.multiply([
            0.213 + cos * 0.787 - sin * 0.213,
            0.715 - cos * 0.715 - sin * 0.715,
            0.072 - cos * 0.072 + sin * 0.928,
            0.213 - cos * 0.213 + sin * 0.143,
            0.715 + cos * 0.285 + sin * 0.14,
            0.072 - cos * 0.072 - sin * 0.283,
            0.213 - cos * 0.213 - sin * 0.787,
            0.715 - cos * 0.715 + sin * 0.715,
            0.072 + cos * 0.928 + sin * 0.072,
          ]);
        }

        grayscale(value = 1) {
          this.multiply([
            0.2126 + 0.7874 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 + 0.2848 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 + 0.9278 * (1 - value),
          ]);
        }

        sepia(value = 1) {
          this.multiply([
            0.393 + 0.607 * (1 - value),
            0.769 - 0.769 * (1 - value),
            0.189 - 0.189 * (1 - value),
            0.349 - 0.349 * (1 - value),
            0.686 + 0.314 * (1 - value),
            0.168 - 0.168 * (1 - value),
            0.272 - 0.272 * (1 - value),
            0.534 - 0.534 * (1 - value),
            0.131 + 0.869 * (1 - value),
          ]);
        }

        saturate(value = 1) {
          this.multiply([
            0.213 + 0.787 * value,
            0.715 - 0.715 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 + 0.285 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 - 0.715 * value,
            0.072 + 0.928 * value,
          ]);
        }

        multiply(matrix) {
          const newR = this.clamp(
            this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]
          );
          const newG = this.clamp(
            this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]
          );
          const newB = this.clamp(
            this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]
          );
          this.r = newR;
          this.g = newG;
          this.b = newB;
        }

        brightness(value = 1) {
          this.linear(value);
        }
        contrast(value = 1) {
          this.linear(value, -(0.5 * value) + 0.5);
        }

        linear(slope = 1, intercept = 0) {
          this.r = this.clamp(this.r * slope + intercept * 255);
          this.g = this.clamp(this.g * slope + intercept * 255);
          this.b = this.clamp(this.b * slope + intercept * 255);
        }

        invert(value = 1) {
          this.r = this.clamp((value + (this.r / 255) * (1 - 2 * value)) * 255);
          this.g = this.clamp((value + (this.g / 255) * (1 - 2 * value)) * 255);
          this.b = this.clamp((value + (this.b / 255) * (1 - 2 * value)) * 255);
        }

        hsl() {
          // Code taken from https://stackoverflow.com/a/9493060/2688027, licensed under CC BY-SA.
          const r = this.r / 255;
          const g = this.g / 255;
          const b = this.b / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h,
            s,
            l = (max + min) / 2;

          if (max === min) {
            h = s = 0;
          } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
              case g:
                h = (b - r) / d + 2;
                break;
              case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
          }

          return {
            h: h * 100,
            s: s * 100,
            l: l * 100,
          };
        }

        clamp(value) {
          if (value > 255) {
            value = 255;
          } else if (value < 0) {
            value = 0;
          }
          return value;
        }
      };
      this.Solver = class Solver {
        constructor(target) {
          this.target = target;
          this.targetHSL = target.hsl();
          this.reusedColor = new self.Color(0, 0, 0); // Object pool
        }

        solve() {
          const result = this.solveNarrow(this.solveWide());
          return {
            values: result.values,
            loss: result.loss,
            filter: this.css(result.values),
          };
        }

        solveWide() {
          const A = 5;
          const c = 15;
          const a = [60, 180, 18000, 600, 1.2, 1.2];

          let best = { loss: Number.POSITIVE_INFINITY };
          for (let i = 0; best.loss > 25 && i < 3; i++) {
            const initial = [50, 20, 3750, 50, 100, 100];
            const result = this.spsa(A, a, c, initial, 1000);
            if (result.loss < best.loss) {
              best = result;
            }
          }
          return best;
        }

        solveNarrow(wide) {
          const A = wide.loss;
          const c = 2;
          const A1 = A + 1;
          const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
          return this.spsa(A, a, c, wide.values, 500);
        }

        spsa(A, a, c, values, iters) {
          const alpha = 1;
          const gamma = 0.16666666666666666;

          let best = null;
          let bestLoss = Number.POSITIVE_INFINITY;
          const deltas = Array.from({ length: 6 });
          const highArgs = Array.from({ length: 6 });
          const lowArgs = Array.from({ length: 6 });

          for (let k = 0; k < iters; k++) {
            const ck = c / (k + 1) ** gamma;
            for (let i = 0; i < 6; i++) {
              deltas[i] = Math.random() > 0.5 ? 1 : -1;
              highArgs[i] = values[i] + ck * deltas[i];
              lowArgs[i] = values[i] - ck * deltas[i];
            }

            const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
            for (let i = 0; i < 6; i++) {
              const g = (lossDiff / (2 * ck)) * deltas[i];
              const ak = a[i] / (A + k + 1) ** alpha;
              values[i] = fix(values[i] - ak * g, i);
            }

            const loss = this.loss(values);
            if (loss < bestLoss) {
              best = values.slice(0);
              bestLoss = loss;
            }
          }
          return { values: best, loss: bestLoss };

          function fix(value, idx) {
            let max = 100;
            if (idx === 2 /* saturate */) {
              max = 7500;
            } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
              max = 200;
            }

            if (idx === 3 /* hue-rotate */) {
              if (value > max) {
                value = value % max;
              } else if (value < 0) {
                value = max + (value % max);
              }
            } else if (value < 0) {
              value = 0;
            } else if (value > max) {
              value = max;
            }
            return value;
          }
        }

        loss(filters) {
          // Argument is array of percentages.
          const color = this.reusedColor;
          color.set(0, 0, 0);

          color.invert(filters[0] / 100);
          color.sepia(filters[1] / 100);
          color.saturate(filters[2] / 100);
          color.hueRotate(filters[3] * 3.6);
          color.brightness(filters[4] / 100);
          color.contrast(filters[5] / 100);

          const colorHSL = color.hsl();
          return (
            Math.abs(color.r - this.target.r) +
            Math.abs(color.g - this.target.g) +
            Math.abs(color.b - this.target.b) +
            Math.abs(colorHSL.h - this.targetHSL.h) +
            Math.abs(colorHSL.s - this.targetHSL.s) +
            Math.abs(colorHSL.l - this.targetHSL.l)
          );
        }

        css(filters) {
          function fmt(idx, multiplier = 1) {
            return Math.round(filters[idx] * multiplier);
          }
          return `filter: invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(
            2
          )}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(
            4
          )}%) contrast(${fmt(5)}%);`;
        }
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-form {
  max-width: 500px;
  margin: 0 auto;
  font-size: 150%;
}

.filter-show {
  text-align: center;
  margin: 10px 16px;
  font-size: 20px;
}

.filter-block {
  display: flex;
  max-width: 300px;
  margin: 40px auto;
  justify-content: space-between;
}

.filter-span {
  width: 140px;
  height: 140px;
  color: gray;
  outline: 1px dotted;
  outline-offset: 2px;
}

.filter-span span {
  position: absolute;
  margin-top: -30px;
  font-size: 14px;
}

.filter-loss {
  text-align: center;
  padding: 10px 16px;
  background-color: #333;
  color: #fff;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>
