import { Routers } from './router/router-config';

export default {
  pages: Object.values(Routers).map((router) => router.replace('/', '')),
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
};
