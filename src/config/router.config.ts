import { RouteConfig } from 'vue-router'

// 管理页面路由
export const manageRouter: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Manage',
    component: () => import('../layouts/basicLayout/index.vue'),  // 最外层路由
    children: [
      {
        path: '/home',
        name: '首页',
        meta: { icon: 'home' },
        component: () => import( '../views/About.vue')
      },
      {
        path: '/gouxiao',
        name: '购销',
        meta: { icon: 'home' },
        component: () => import('../views/About.vue')
      },
      {
        path: '/wuliu',
        name: '物流',
        meta: { icon: 'home' },
        component: () => import('../views/About.vue')
      },
      {
        path: '/wuliu',
        name: '仓储',
        meta: { icon: 'home' },
        component: () => import('../views/About.vue')
      },
      {
        path: '/wuliu',
        name: '财务',
        meta: { icon: 'home' },
        component: () => import('../views/About.vue')
      },
      {
        path: '/wuliu',
        name: '档案',
        meta: { icon: 'home' },
        component: () => import('../views/About.vue')
      },
      {
        path: '/system',
        name: '系统',
        meta: { icon: 'home' },
        component: () => import('../views/About.vue'),
        children: [
          {
            path: '/system/member/list',
            name: '用户管理',
            component: () => import('../views/About.vue'),
          },
          {
            path: '/system/role/list',
            name: '角色权限管理',
            component: () => import('../views/About.vue'),
          },
          {
            path: '/system/approve/list',
            name: '审批管理',
            component: () => import('../views/About.vue'),
          }
        ]
      },
      {
        path: '/404',
        name: '404',
        meta: { notMenu: true },
        component: () => import('../views/exception/404.vue'),
      } 
    ]
  },
  {
    path: '*',
    redirect: '/404'
  },
]


// 基础路由
export const baseRouter: Array<RouteConfig> = [

]