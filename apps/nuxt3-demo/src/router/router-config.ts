import type {
  RouteComponent,
  RouteMeta,
  RouteRecordRedirectOption,
} from 'vue-router';
import type { HttpCache } from '~/constants/http-cache';

export interface RouteView {
  name?: RouterNames;
  path: string;
  component: RouteComponent;
  maxAge?: HttpCache;
  redirect?: RouteRecordRedirectOption | undefined;
  children?: RouteView[];
  meta?: RouteMeta;
}

export enum RouterNames {
  Home = 'Home',
  Test = 'Test',
  Error = 'Error',
}

const _home = {
  name: RouterNames.Home,
  path: '/',
  component: () => import('~/pages/HomePage.vue'),
};

const _test = {
  name: RouterNames.Test,
  path: '/test',
  component: () => import('~/pages/TestPage.vue'),
};

export const routes: RouteView[] = [_home, _test];
