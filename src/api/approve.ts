import {
  axios
} from '@/utils/request'

export const api = {
  list: '/activity/getApproveList',
  // 获取审批表单名称的选择框选项
  worksList: '/activity/worksList',
  deleteWorksList: '/activity/deleteWorksList',
  allApprove: '/activity/allApprove',
  create: '/activity/deploy',
  detail: '/activity/selectById',
  del: '/activity/delete'
}

export function list(parameter?: Object) {
  return axios({
    url: api.list,
    method: 'get',
    params: parameter
  })
}

export function selectList(parameter?: Object) {
  return new Promise((resolve, reject) => {
    axios({
      url: api.list,
      method: 'get',
      params: parameter
    }).then((res: any) => {
      var result = [];
      for (let i in res.list) {
        result.push({
          label: res.list[i]?.activityId,
          value: res.list[i]?.id
        })
      }
      resolve(result);
    })
  })
}

export function deleteWorksList(parameter?: Object): Promise<Object> {
  return new Promise((resolve, reject) => {
    axios({
      url: api.deleteWorksList,
      method: 'get',
      params: parameter
    }).then((res: any) => {
      var result = [];
      for (let i in res) {
        result.push({
          label: res[i]?.approveName,
          value: res[i]?.id
        })
      }
      resolve(result);
    })
  })
}

export function worksList(parameter?: Object): Promise<Object> {
  return new Promise((resolve, reject) => {
    axios({
      url: api.worksList,
      method: 'get',
      params: parameter
    }).then((res: any) => {
      var result = [];
      for (let i in res) {
        result.push({
          label: res[i]?.approveName,
          value: res[i]?.id
        })
      }
      resolve(result);
    })
  })
}

export function allApprove(parameter?: Object): Promise<Object> {
  return new Promise((resolve, reject) => {
    axios({
      url: api.allApprove,
      method: 'get',
      params: parameter
    }).then((res: any) => {
      var result = [];
      for (let i in res) {
        result.push({
          label: res[i]?.approveName,
          value: res[i]?.id
        })
      }
      resolve(result);
    })
  })
}

export function create(parameter?: Object) {
  return axios({
    url: api.create,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function detail(parameter?: Object) {
  return axios({
    url: api.detail,
    method: 'get',
    params: parameter
  })
}

export function del(parameter?: Object) {
  return axios({
    url: api.del,
    method: 'get',
    params: parameter
  })
}