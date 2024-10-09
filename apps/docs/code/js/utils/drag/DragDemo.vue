<script lang="ts" setup>
import { onMounted } from 'vue';

let dragging = false;
let cloneEl: HTMLImageElement | null = null;
let initial: any = {};

onMounted(() => {
  const list = document.getElementById('list');
  const dragDemo = document.getElementById('drag-demo');
  const contentEl = document.getElementById('content');
  if (!list || !contentEl || !dragDemo) {
    return;
  }
  list.addEventListener('mousedown', (e: any) => {
    e.preventDefault();
    if (!e?.target) {
      return;
    }
    if (e.target.classList.contains('item') && !cloneEl) {
      dragDemo.classList.add('active');
      // 选中了元素
      cloneEl = e.target.cloneNode(true);
      if (!cloneEl) {
        return;
      }
      cloneEl.classList.add('flutter');
      // 初始化数据
      init(e, { width: e.target.offsetWidth }, Math.random());

      e.target.parentElement.appendChild(cloneEl);
      dragging = true;
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (dragging && cloneEl) {
      moveFlutter(e.pageX - initial.offsetX, e.pageY - initial.offsetY);
      distance({ pageX: e.pageX, pageY: e.pageX });
    }
  });

  contentEl.addEventListener('mouseup', (e: any) => {
    if (e.target.id !== 'content') {
      const lostX = e.x - contentEl.getBoundingClientRect().left;
      const lostY = e.y - contentEl.getBoundingClientRect().top;
      done(lostX, lostY);
    } else {
      done(e.offsetX, e.offsetY);
    }
  });

  // 鼠标抬起
  window.addEventListener('mouseup', () => {
    dragging = false;
    dragDemo.classList.remove('active');
    setTimeout(() => {
      end();
    }, 10);
  });
  // 鼠标离开了视窗
  document.addEventListener('mouseleave', () => {
    end();
  });
  // 用户可能离开了浏览器
  window.onblur = () => {
    end();
  };

  // 结束处理（动画）
  function end() {
    dragging = false;
    if (!cloneEl) {
      return;
    }
    setTimeout(() => {
      cloneEl && cloneEl.remove();
      cloneEl = null;
    }, 300);
  }
  // 完成处理
  function done(x: number, y: number) {
    if (!cloneEl) {
      return;
    }
    const newEl: any = cloneEl.cloneNode(true);
    newEl.classList.remove('flutter');
    newEl.style.cssText = `left: ${x - initial.offsetX}px; top: ${
      y - initial.offsetY
    }px;`;
    if (!contentEl) {
      return;
    }
    contentEl.appendChild(newEl);
    cloneEl.remove();
    cloneEl = null;
  }

  // 改变漂浮元素（合并多个操作）
  function moveFlutter(x: number, y: number) {
    const options = [`left: ${x}px`, `top: ${y}px`];
    changeStyle(options);
  }
  function changeStyle(arr: any) {
    if (!cloneEl) {
      return;
    }
    const original = cloneEl.style.cssText.split(';');
    original.pop();
    cloneEl.style.cssText = `${original.concat(arr).join(';')};`;
  }

  // 记录鼠标初始化事件
  function init(
    { offsetX, offsetY, pageX, pageY }: Record<string, number>,
    { width }: Record<string, number>,
    flag: number,
  ) {
    initial = { offsetX, offsetY, pageX, pageY, width, flag };
    moveFlutter(pageX - offsetX, pageY - offsetY);
  }

  // 计算两点之间距离
  function distance({ pageX, pageY }: Record<string, number>) {
    const { pageX: x, pageY: y } = initial;
    const b = pageX - x;
    const a = pageY - y;
    // return Math.sqrt(Math.pow(b, 2) + Math.pow(a, 2))

    return Math.hypot(b, a);
  }
});
</script>

<template>
  <div id="drag-demo">
    <div id="list" class="grid">
      <img class="item" src="/logo.png" />
    </div>
    <div id="content">
      <span id="tip">拖动图片放置于此</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#drag-demo {
  position: relative;
}
.active {
  cursor: grabbing;
}

.flutter {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}

#content {
  position: relative;
  min-height: 100px;
  margin-left: 45px;
  background: rgba(0, 0, 0, 0.07);
  #tip {
    color: #999999;
    font-size: 28px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .item {
    position: absolute;
    transform-origin: top left;
  }
}
</style>
