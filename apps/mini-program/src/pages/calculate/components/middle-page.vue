<script setup lang="ts">
import { onMounted, ref } from 'vue';
const emit = defineEmits(['onChangeStatus']);
const mathList: any[] = [];
const current = ref<any>({});

function createMath() {
  //  生成2-10的随机数
  const result = Math.floor(Math.random() * 8) + 2;
  const operator = Math.random() > 0.5 ? '+' : '-'; // 生成规则
  const firstNumber = Math.floor(Math.random() * (result - 1)) + 1;
  const secondNumber = result - firstNumber;
  if (operator === '+') {
    return {
      firstNumber,
      secondNumber,
      operator,
      result,
    };
  } else {
    return {
      firstNumber: result,
      secondNumber: firstNumber,
      operator,
      result: secondNumber,
    };
  }
}

function answerClick(answer) {
  if (mathList.length === 0) {
    emit('onChangeStatus', 'success');
    return;
  }
  if (answer === current.value.result) {
    current.value = mathList.shift();
  }
}

onMounted(() => {
  for (let i = 0; i < 10; i++) {
    mathList.push(createMath());
  }
  current.value = mathList.shift();
});
</script>

<template>
  <view class="middle-page">
    <view style="display: flex">
      <view>{{ current.firstNumber }}</view>
      <view>{{ current.operator }}</view>
      <view>{{ current.secondNumber }}</view>
    </view>
    <view class="answer">
      <view class="answer-button" @tap="answerClick(i)" v-for="i in 10">
        {{ i }}
      </view>
    </view>
  </view>
</template>
