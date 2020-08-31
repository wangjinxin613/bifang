/**
 * 本系统采用四层路由架构体系
 * 第一层 最外层基础路由 basic 是管理系统的最外层框架，包含顶部和侧边栏等
 * 第二层 业务类型路由 viewType 业务类型是指将不同类型的业务进行分组
 * 第三层 模板路由 template 模板包括列表模板、表单模板、默认模板
 * 第四次 业务路由 view 真实的业务路由，最终触达的路由
 */
import { RouteConfig } from 'vue-router'
import { defaultViewType } from '../layouts/viewType';

// 第二层路由的模板类型
export const templateType: any = {
  default: {
    name: 'default',  // 默认型
    component: () => import('../layouts/template/default.vue')
  },
  list: {   // 列表型
    name: 'list',
    component: () => import('../layouts/template/list')
  },
  form: {
    name: 'form', // 表单型
    component: () => import('../layouts/template/list/index')
  }
};

const templateView = {};
Object.keys(templateType).forEach((key) => {
  Object.assign(templateView, {
    [key]: templateType[key].component
  });
})

// 管理页面路由
export const manageRouter: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Manage',
    redirect: '/home',
    component: () => import('../layouts/basic/index.vue'),  // 最外层路由
    children: [
      {
        path: '/home',
        name: '首页',
        component: () => import( '../views/Home.vue')
      },
      {
        path: '/gouxiao',
        name: '购销',
        component: () => import('../views/About.vue')
      },
      {
        path: '/wuliu',
        name: '物流',
        component: () => import('../views/About.vue')
      },
      {
        path: '/wuliu',
        name: '仓储',
        component: () => import('../views/About.vue')
      },
      {
        path: '/wuliu',
        name: '财务',
        component: () => import('../views/About.vue')
      },
      {
        path: '/wuliu',
        name: '档案',
        component: () => import('../views/About.vue')
      },
      {
        path: '/system',
        name: '系统',
        redirect: '/system/member/list',
        components: defaultViewType,
        children: [
          {
            path: '/system/member',
            redirect: '/system/member/list',
            name: '用户管理',
            components: templateView,
            children: [
              {
                path: '/system/member/list',
                name: '全部',
                meta: { template: templateType.default.name },
                component: () => import('../views/system/member/list.vue'),
              }
            ]
          },
          {
            path: '/system/role/list',
            name: '角色权限管理',
            component: () => import('../views/About.vue'),
          },
          {
            path: '/system/approve',
            redirect: '/system/approve/list',
            name: '审批管理',
            components: templateView,
            children: [
              {
                path: '/system/approve/list',
                name: '全部',
                meta: { template: templateType.list.name },
                component: () => import('../views/system/approve/list'),
              },
              {
                path: '/system/approve/detail',
                name: '审批流程',
                meta: { template: templateType.list.name },
                component: () => import('../views/system/approve/detail'),
              }
            ]
          }
        ]
      },
      {
        path: '/404',
        name: '404',
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