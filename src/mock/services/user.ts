import Mock from 'mockjs'

// 模拟审批管理列表数据
Mock.mock(/\/mock\/user\/list/, 'get', {
  'list|10': [{
    'id|+1': 0,
    'username': '@cname',
    'roleName|+1': ['采购','风控', '业务员'],
    'nickName': '@cname',
    'sex|+1': ['男', '女'],
    'phone': /^1[385][1-9]\d{8}/
  }],
  'pageSize': 1,
  'curPage': 1,
  'totalCount': 20
})

// 获取权限列表
Mock.mock('/mock/user/getRoleName', 'get', {
  0: {
    'id|+1': 0,
    'roleName': '风控',
  },
  1: {
    'id|+1': 1,
    'roleName': '采购',
  },
  2: {
    'id|+1': 2,
    'roleName':  '运营',
  }
})

// 审批表单名称(未设置过审批流的)
Mock.mock(/\/mock\/activity\/worksList/, 'get', {
  0: {
    'id|+1': 0,
    'approveName': '采购订单',
  },
  1: {
    'id|+1': 1,
    'approveName': '采购合同',
  },
  2: {
    'id|+1': 2,
    'approveName':  '订单验收',
  }
})

// 权限列表
Mock.mock(/\/mock\/activity\/roleList/, 'get', {
  0: {
    'id': 0,
    'roleName': '销售',
  },
  1: {
    'id': 1,
    'roleName': '采购',
  },
  2: {
    'id': 2,
    'roleName':  '风控',
  },
  3: {
    'id': 3,
    'roleName':  '总监',
  }
})


// 审批流设置详情
Mock.mock(/\/mock\/activity\/selectById/, 'get', {
  'id|+1': 0,
  'activityId|+1': '采购订单',
  'workId': 1,
  'describtion': '这是一个审批流的设置啊',
  'details|1-4': {
    0: {
      roles: '0, 2'
    },
    1: {
      roles: '0, 1'
    },
    2: {
      roles: '2, 3'
    }
  }
})