import { isServer } from '@syseven/utils';

export default defineNuxtRouteMiddleware((to, from) => {
  if (isServer()) {
    return;
  }
  if (from.fullPath && to.fullPath !== from.fullPath) {
    window['_sy_referer'] = location.origin + from.fullPath;
  }
});
