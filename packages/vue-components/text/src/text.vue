<template>
  <component
    :is="tag"
    v-if="!isScriptCollapse"
    ref="root"
    :class="textKls"
    :style="textStyle"
  >
    <slot>
      {{ props.content }}
    </slot>
  </component>
  <div v-else ref="root" :class="textKls">
    {{ expanded ? props.content : text
    }}<span v-if="hasExpand" @click="switchExpanded">{{
      expanded ? props.collapseText : props.expandText
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useNamespace } from '@syseven/hooks';
import { textPropsDefault, type textPropsType } from './text';
// style
import '../style/index';

defineOptions({
  name: 'SyText',
});

const props = withDefaults(defineProps<textPropsType>(), textPropsDefault);

const text = ref('');
const expanded = ref(false);
const hasExpand = ref(false);
const root = ref<HTMLElement>();

const ns = useNamespace('text');

const isScriptCollapse = computed(() => {
  if (!props.rows) {
    return false;
  }
  if (!props.rows) {
    return false;
  }
  if (!props.expandText) {
    return false;
  }
  return true;
});

const textStyle = computed(() => {
  if (isScriptCollapse.value) {
    return null;
  }
  if (!props.rows || props.rows <= 1) {
    return null;
  }
  return {
    '-webkit-line-clamp': props.rows,
  };
});

const textKls = computed(() => {
  const classNames = [ns.b()];
  if (props.rows && !isScriptCollapse.value) {
    const modifyClassName = ns.m(`ellipsis${props.rows > 1 ? `-mutiple` : ''}`);
    classNames.push(modifyClassName);
  }
  return classNames;
});

const switchExpanded = () => {
  expanded.value = !expanded.value;
};

const pxToNum = (value: string | null) => {
  if (!value) return 0;
  const match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
};

// TODO 优化算法，并添添加截流
const calcEllipsised = () => {
  if (!props.content) {
    return;
  }
  const cloneContainer = () => {
    if (!root.value) {
      return;
    }
    if (!props.content) {
      return;
    }

    const originStyle = window.getComputedStyle(root.value);
    const container = document.createElement('div');
    if (!container) {
      return;
    }
    const styleNames: string[] = Array.prototype.slice.apply(originStyle);
    styleNames.forEach((name) => {
      container.style.setProperty(name, originStyle.getPropertyValue(name));
    });

    container.style.position = 'fixed';
    container.style.zIndex = '-9999';
    container.style.top = '-9999px';
    container.style.height = 'auto';
    container.style.minHeight = 'auto';
    container.style.maxHeight = 'auto';

    container.innerText = props.content;
    document.body.appendChild(container);
    return container;
  };

  const calcEllipsisText = (container: HTMLDivElement, maxHeight: number) => {
    const { dots, content, expandText } = props;
    if (!content) {
      return '';
    }

    let left = 0;
    let right = content.length;
    let res = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      container.innerText = `${content.slice(0, mid)} ${dots}${expandText}`;
      if (container.offsetHeight <= maxHeight) {
        left = mid + 1;
        res = mid;
      } else {
        right = mid - 1;
      }
    }
    return content.slice(0, res) + dots;
  };

  const container = cloneContainer();
  if (!container) {
    return;
  }

  const { paddingBottom, paddingTop, lineHeight } = container.style;
  const maxHeight =
    (Number(props.rows) + 0.5) * pxToNum(lineHeight) +
    pxToNum(paddingTop) +
    pxToNum(paddingBottom);
  if (maxHeight < container.offsetHeight) {
    hasExpand.value = true;
    text.value = calcEllipsisText(container, maxHeight);
  } else {
    hasExpand.value = false;
    text.value = props.content;
  }

  document.body.removeChild(container);
};

watch(
  () => props.content,
  () => {
    if (isScriptCollapse.value) {
      calcEllipsised();
    }
  },
);

onMounted(() => {
  calcEllipsised();
  window.addEventListener('resize', calcEllipsised);
});

onUnmounted(() => {
  window.removeEventListener('resize', calcEllipsised);
});
</script>
