import {
  axios
} from '@/utils/request'

export const api = {
  list: '/activity/getApproveList',
  // 获取审批表单名称的选择框选项
  worksList: '/activity/worksList',
  create: '/activity/deploy'
}

export function list(parameter?: Object) {
  return axios({
     url: api.list,
     method: 'get',
     params: parameter
  })
}

export function worksList(parameter?: Object) : Promise<Object>{
  return new Promise((resolve,reject) => {
    axios({
      url: api.worksList,
      method: 'get',
      params: parameter
   }).then((res:any)=> {
     var result = [];
     for(let i in res) {
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
     headers:{
      'Content-Type':'application/json'
    }
  })
}