// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';
import Xiami from '@syseven/xiami';
import DefaultTheme from 'vitepress/theme';
import '@syseven/style/src/reset.scss';
import 'element-plus/dist/index.css';
import {
  ElButton,
  ElColorPicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElRadio,
  ElSlider,
  ElTable,
  ElTableColumn,
} from 'element-plus';
import './style.scss';
import '@syseven/style/src/index.scss';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(Xiami);
    app.component('ElForm', ElForm);
    app.component('ElFormItem', ElFormItem);
    app.component('ElInput', ElInput);
    app.component('ElInputNumber', ElInputNumber);
    app.component('ElButton', ElButton);
    app.component('ElRadio', ElRadio);
    app.component('ElSlider', ElSlider);
    app.component('ElColorPicker', ElColorPicker);
    app.component('ElTable', ElTable);
    app.component('ElTableColumn', ElTableColumn);
  },
} satisfies Theme;
