/**
 * 菜单
 */
export default [
  {
    path: '/home',
    name: '首页',
    meta: { icon: 'home' },
  },
  {
    path: '/gouxiao',
    name: '购销',
    meta: { icon: 'money-collect' },
  },
  {
    path: '/wuliu',
    name: '物流',
    meta: { icon: 'car' },
  },
  {
    path: '/wuliu',
    name: '仓储',
    meta: { icon: 'bank' },
  },
  {
    path: '/wuliu',
    name: '财务',
    meta: { icon: 'pay-circle' },
  },
  {
    path: '/wuliu',
    name: '档案',
    meta: { icon: 'file-search' },
  },
  {
    path: '/system',
    name: '系统',
    meta: { icon: 'setting' },
    children: [
      {
        path: '/system/member',
        name: '用户管理',
        children: [
          {
            path: '/system/member/list',
            name: '全部',
          }
        ]
      },
      {
        path: '/system/role/list',
        name: '角色权限管理',
      },
      {
        path: '/system/approve',
        name: '审批管理',
        children: [
          {
            path: '/system/approve/list',
            name: '全部',
          }
        ]
      }
    ]
  }
]