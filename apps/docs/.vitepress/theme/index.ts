// https://vitepress.dev/guide/custom-theme
import Xiami from '@syseven/xiami'
import DefaultTheme from 'vitepress/theme'
// import Layout from './Layout.vue'
import '@syseven/style/src/reset.scss';
import 'element-plus/dist/index.css'
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElButton, ElRadio, ElSlider, ElColorPicker, ElTable, ElTableColumn } from 'element-plus'
import './style.scss'
import '@syseven/style/src/index.scss';

export default {
  // Layout,
  ...DefaultTheme,
  enhanceApp({ app, router, siteData, ...rest }) {
    DefaultTheme.enhanceApp({ app, router, siteData, ...rest })
    app.use(Xiami)
    app.component(ElForm.name, ElForm)
    app.component(ElFormItem.name, ElFormItem)
    app.component(ElInput.name, ElInput)
    app.component(ElInputNumber.name, ElInputNumber)
    app.component(ElButton.name, ElButton)
    app.component(ElRadio.name, ElRadio)
    app.component(ElSlider.name, ElSlider)
    app.component(ElColorPicker.name, ElColorPicker)
    app.component(ElTable.name, ElTable)
    app.component(ElTableColumn.name, ElTableColumn)
  }
}
