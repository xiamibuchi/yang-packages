// https://vitepress.dev/guide/custom-theme
import Xiami from '@syseven/xiami'
import Layout from './Layout.vue'
import './style.css'
import '@syseven/style/src/index.scss';

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.use(Xiami)
  }
}
