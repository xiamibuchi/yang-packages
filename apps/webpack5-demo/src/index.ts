import { createApp } from 'vue';
import demo from './demo.svg';
import App from './App.vue';

function helloWepack() {
  console.log(demo);
}
helloWepack();

const app = createApp(App);
app.mount('#app');
