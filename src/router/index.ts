import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { manageRouter } from '../config/router.config';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  ...manageRouter
]

const router = new VueRouter({
  routes
})

export default router
