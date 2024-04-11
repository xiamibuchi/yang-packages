import type { RouterConfig } from '@nuxt/schema';
import { routes } from '~/router/router-config';

export default <RouterConfig>{
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  routes: () => routes,
  hashMode: false,
  scrollBehaviorType: 'auto',
};
