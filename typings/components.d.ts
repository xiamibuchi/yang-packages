// For this project development
import { defineCustomElement } from 'vue';
import TextSFC from '../packages/vue-components/text/src/text.vue';

// turn component into web components
export const Text = defineCustomElement(TextSFC);

declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    Text: typeof Text;
  }
}

export {};
