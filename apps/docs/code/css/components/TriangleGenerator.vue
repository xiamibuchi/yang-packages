<template>
  <div class="triangle-generator">
    <div class="triangle-container">
      <div
        class="triangle-demo"
        :style="{ borderWidth: lengths, borderColor: colors }"
      />
    </div>
    <div class="tool-wrap">
      <section class="tool-flex">
        <div>
          <h4>方向</h4>
          <div class="direction-contianer">
            <div class="placeholder" />
            <div class="square rotate">
              <label
                v-for="item in directionList"
                :key="item"
                class="direction-label"
                :class="setActive(item)"
                ><input
                  :id="item"
                  v-model="direction"
                  type="radio"
                  name="direction"
                  :value="item"
              /></label>
            </div>

            <div class="square">
              <label
                v-for="item in squareList"
                :key="item"
                class="direction-label"
                :class="setActive(item)"
                ><input
                  :id="item"
                  v-model="direction"
                  type="radio"
                  name="direction"
                  :value="item"
              /></label>
            </div>
            <!-- {{direction}} -->
          </div>
        </div>
        <div>
          <h4>颜色</h4>
          <el-color-picker v-model="choosenColor" @change="update" />
        </div>
      </section>
      <section>
        <h4>类型</h4>
        <el-radio v-if="showEqu" v-model="type" label="equ">等边</el-radio>
        <el-radio v-model="type" label="iso">等腰</el-radio>
        <el-radio v-model="type" label="sca">不等边</el-radio>
      </section>
      <section class="size-section">
        <h4>大小</h4>
        <p>宽度</p>
        <el-input-number
          v-model="width"
          :disabled="widthDisable"
          :min="0"
          :max="300"
          size="small"
          @change="update"
        />
        <div class="tool-flex">
          <div>
            <p>左</p>
            <el-input-number
              v-model="left"
              :disabled="leftDisable"
              :min="0"
              :max="150"
              size="small"
              @change="update"
            />
          </div>
          <div class="ml-10">
            <p>右</p>
            <el-input-number
              v-model="right"
              :disabled="rightDisable"
              :min="0"
              :max="150"
              size="small"
              @change="update"
            />
          </div>
        </div>
        <p>高度</p>
        <el-input-number
          v-model="height"
          :disabled="heightDisable"
          :min="0"
          :max="300"
          size="small"
          @change="update"
        />
        <div class="tool-flex">
          <div>
            <p>上</p>
            <el-input-number
              v-model="top"
              :disabled="topDisable"
              :min="0"
              :max="150"
              size="small"
              @change="update"
            />
          </div>
          <div class="ml-10">
            <p>下</p>
            <el-input-number
              v-model="bottom"
              :disabled="bottomDisable"
              :min="0"
              :max="150"
              size="small"
              @change="update"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
  <div style="width: 100%">
    <h3>CSS</h3>
    <div class="language-css extra-class">
      <pre class="language-css shiki material-theme-palenight">
        <code ref="code-container" v-html="cssCode"/>
      </pre>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import 'highlight.js/styles/pojoaque.css';
hljs.registerLanguage('css', css);

const colorDirection = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
  topRight: 'right',
  bottomRight: 'bottom',
  bottomLeft: 'left',
  topLeft: 'top',
  code: '',
};
const lengthDirection = {
  top: {
    top: false,
    right: 'width-right',
    bottom: 'height',
    left: 'width-left',
  },
  right: {
    top: 'height-top',
    right: false,
    bottom: 'height-bottom',
    left: 'width',
  },
  bottom: {
    top: 'height',
    right: 'width-right',
    bottom: false,
    left: 'width-left',
  },
  left: {
    top: 'height-top',
    right: 'width',
    bottom: 'height-bottom',
    left: false,
  },
  topRight: {
    top: false,
    right: 'width',
    bottom: 'height',
    left: false,
  },
  bottomRight: {
    top: false,
    right: false,
    bottom: 'height',
    left: 'width',
  },
  bottomLeft: {
    top: 'height',
    right: false,
    bottom: false,
    left: 'width',
  },
  topLeft: {
    top: 'height',
    right: 'width',
    bottom: false,
    left: false,
  },
};

const directionList = ['top', 'right', 'left', 'bottom'];
const squareList = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];

export default {
  data() {
    return {
      type: 'iso',
      choosenColor: '#00adb5',
      direction: 'top',
      width: 100,
      height: 100,
      left: 50,
      right: 50,
      top: 50,
      bottom: 50,
      showEqu: true,
      lengths: '',
      colors: '',
      widthDisable: false,
      heightDisable: false,
      leftDisable: false,
      rightDisable: false,
      topDisable: false,
      bottomDisable: false,
      directionList,
      squareList,
      cssCode: '',
    };
  },
  watch: {
    direction() {
      this.changeSetup();
      this.changeSize();
      this.updateCSS();
    },
    type() {
      this.changeSetup();
      this.changeSize();
      this.updateCSS();
    },
  },
  mounted() {
    this.changeSetup();
    this.changeSize();
    this.updateCSS();
  },
  methods: {
    update() {
      this.changeSize();
      this.updateCSS();
    },
    setActive(dir) {
      return dir == this.direction ? 'active' : '';
    },
    changeSize() {
      if (
        this.direction == 'top' ||
        this.direction == 'bottom' ||
        this.direction == 'left' ||
        this.direction == 'right'
      ) {
        if (this.widthDisable) {
          this.width = this.left * 1 + this.right * 1;
        } else {
          this.left = (this.width * 1) / 2;
          this.right = (this.width * 1) / 2;
        }
        if (this.heightDisable) {
          this.height = this.top * 1 + this.bottom * 1;
        } else {
          this.top = (this.height * 1) / 2;
          this.bottom = (this.height * 1) / 2;
        }
      } else if (this.type == 'iso') {
        this.left = (this.width * 1) / 2;
        this.right = (this.width * 1) / 2;
        this.top = (this.height * 1) / 2;
        this.bottom = (this.height * 1) / 2;
      }
    },
    async updateCSS() {
      const lengths = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };
      const colors = {
        top: 'transparent',
        right: 'transparent',
        bottom: 'transparent',
        left: 'transparent',
      };
      const lengthDirections = lengthDirection[this.direction];
      colors[colorDirection[this.direction]] = this.choosenColor;
      for (const key in lengthDirections) {
        if (lengthDirections[key] === false) {
          lengths[key] = '0';
        } else {
          switch (this.type) {
            case 'equ':
              if (this.direction == 'top' || this.direction == 'bottom') {
                const equHeight = ((Math.sqrt(3) / 2) * this.width).toFixed(1);
                switch (lengthDirections[key]) {
                  case 'width':
                    lengths[key] = `${equHeight}px`;
                    break;
                  case 'height':
                    lengths[key] = `${equHeight}px`;
                    break;
                  case 'width-left':
                    lengths[key] = `${this.width / 2}px`;
                    break;
                  case 'width-right':
                    lengths[key] = `${this.width / 2}px`;
                    break;
                }
              } else if (
                this.direction == 'left' ||
                this.direction == 'right'
              ) {
                const equHeight = ((Math.sqrt(3) / 2) * this.height).toFixed(1);
                switch (lengthDirections[key]) {
                  case 'width':
                    lengths[key] = `${equHeight}px`;
                    break;
                  case 'height':
                    lengths[key] = `${equHeight}px`;
                    break;
                  case 'height-top':
                    lengths[key] = `${this.height / 2}px`;
                    break;
                  case 'height-bottom':
                    lengths[key] = `${this.height / 2}px`;
                    break;
                }
              }
              break;
            case 'iso':
              switch (lengthDirections[key]) {
                case 'width':
                  lengths[key] = `${this.width}px`;
                  break;
                case 'height':
                  lengths[key] = `${this.height}px`;
                  break;
                case 'width-left':
                  lengths[key] = `${this.width / 2}px`;
                  break;
                case 'width-right':
                  lengths[key] = `${this.width / 2}px`;
                  break;
                case 'height-top':
                  lengths[key] = `${this.height / 2}px`;
                  break;
                case 'height-bottom':
                  lengths[key] = `${this.height / 2}px`;
                  break;
              }
              break;
            case 'sca':
              switch (lengthDirections[key]) {
                case 'width':
                  lengths[key] = `${this.width}px`;
                  break;
                case 'height':
                  lengths[key] = `${this.height}px`;
                  break;
                case 'width-left':
                  lengths[key] = `${this.left}px`;
                  break;
                case 'width-right':
                  lengths[key] = `${this.right}px`;
                  break;
                case 'height-top':
                  lengths[key] = `${this.top}px`;
                  break;
                case 'height-bottom':
                  lengths[key] = `${this.bottom}px`;
                  break;
              }
              break;
          }
        }
      }

      this.lengths = this.toArray(lengths).join(' ');
      this.colors = this.toArray(colors).join(' ');

      const outputCssStr = `.triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: ${this.lengths};
  border-color: ${this.colors};
}`;
      const highlightedCode = hljs.highlight(outputCssStr, {
        language: 'css',
      }).value;
      this.cssCode = highlightedCode;
    },

    changeSetup() {
      if (
        this.direction == 'topRight' ||
        this.direction == 'bottomRight' ||
        this.direction == 'bottomLeft' ||
        this.direction == 'topLeft'
      ) {
        if (this.type == 'equ') {
          this.type = 'iso';
        }
        this.showEqu = false;
      } else {
        this.showEqu = true;
      }

      switch (this.type) {
        case 'equ':
          if (this.direction == 'top' || this.direction == 'bottom') {
            this.widthDisable = false;
            this.heightDisable = true;
            this.leftDisable = true;
            this.rightDisable = true;
            this.topDisable = true;
            this.bottomDisable = true;
          } else if (this.direction == 'left' || this.direction == 'right') {
            this.widthDisable = true;
            this.heightDisable = false;
            this.leftDisable = true;
            this.rightDisable = true;
            this.topDisable = true;
            this.bottomDisable = true;
          } else {
            this.widthDisable = false;
            this.heightDisable = false;
            this.leftDisable = true;
            this.rightDisable = true;
            this.topDisable = true;
            this.bottomDisable = true;
          }
          break;
        case 'iso':
          this.widthDisable = false;
          this.heightDisable = false;
          this.leftDisable = true;
          this.rightDisable = true;
          this.topDisable = true;
          this.bottomDisable = true;
          break;
        case 'sca':
          if (this.direction == 'top' || this.direction == 'bottom') {
            this.widthDisable = true;
            this.heightDisable = false;
            this.leftDisable = false;
            this.rightDisable = false;
            this.topDisable = true;
            this.bottomDisable = true;
          } else if (this.direction == 'left' || this.direction == 'right') {
            this.widthDisable = false;
            this.heightDisable = true;
            this.leftDisable = true;
            this.rightDisable = true;
            this.topDisable = false;
            this.bottomDisable = false;
          } else {
            this.widthDisable = false;
            this.heightDisable = false;
            this.leftDisable = true;
            this.rightDisable = true;
            this.topDisable = true;
            this.bottomDisable = true;
          }
          break;
      }
    },
    toArray(obj) {
      const arr = [];
      for (const key in obj) {
        arr.push(obj[key]);
      }
      return arr;
    },
  },
};
</script>

<style lang="scss">
.triangle-generator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  flex-wrap: wrap;

  .ml-10 {
    margin-left: 10px;
  }
  h4 {
    margin-top: 15px;
    margin-bottom: 8px;
  }

  .triangle-container {
    margin: 10px auto 0;
    .triangle-demo {
      width: 0;
      height: 0;
      border-style: solid;
      transition: all 0.3s;
    }
  }

  .tool-wrap {
    flex: 1;
    @media (min-width: 500px) {
      flex: initial;
    }
  }

  .direction-contianer {
    width: 140px;
    height: 140px;
    position: relative;
    .placeholder {
      width: 60px;
      height: 60px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      background-color: #fff;
      z-index: 10;
    }
    .square {
      width: 100px;
      height: 100px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      z-index: 1;
      .direction-label {
        background: #d1f4fa;
        &:hover {
          background: #53cde2;
        }
        &.active {
          background: #ff1f5a;
        }
      }
      &.rotate {
        width: 85px;
        height: 85px;
        transform: rotate(45deg);
        z-index: 2;
        bottom: 0;
        right: 0;
        margin: auto;
        .direction-label {
          background: #8e98f5;
          &:hover {
            background: #7874f2;
          }
          &.active {
            background: #ff1f5a;
          }
        }
      }
    }
    .direction-label {
      width: 50%;
      height: 50%;
      float: left;
      cursor: pointer;
      transition: all 0.3s;
    }
    input[type='radio'] {
      display: none;
    }
  }

  .size-section {
    p {
      margin: 10px 0 6px 0;
    }
  }
  .tool-flex {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>
