import Mock from 'mockjs'

// 模拟审批管理列表数据
Mock.mock(/\/mock\/approve\/list/, 'get', {
  'list|10': [{
      'id|+1': 0,
      'name': '@cname'
  }],
  'pageSize': 1,  
  'curPage': 1,
  'totalCount': 20
})