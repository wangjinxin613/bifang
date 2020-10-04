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
    path: '/sale',
    name: '购销',
    meta: { icon: 'money-collect' },
  },
  {
    path: '/logistics',
    name: '物流',
    meta: { icon: 'car' },
  },
  {
    path: '/storage',
    name: '仓储',
    meta: { icon: 'bank' },
  },
  {
    path: '/finance',
    name: '财务',
    meta: { icon: 'pay-circle' },
  },
  {
    path: '/archives',
    name: '档案',
    meta: { icon: 'file-search' },
  },
  {
    path: '/system',
    name: '系统',
    meta: { icon: 'setting' },
    children: [
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