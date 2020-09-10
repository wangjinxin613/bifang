import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { manageRouter } from '../config/router.config';
import compiler from '@/core/compiler.tsx';

const compilerObject = new compiler();

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  ...compilerObject.router
]

const router = new VueRouter({
  routes
})

export default router

export const menuConfig = compilerObject.menus