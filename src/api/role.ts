import {
  axios
} from '@/utils/request'

export const api = {
  // 角色名称的选择框选项
  selectList: '/activity/roleList',
}

export function selectList(parameter?: Object) : Promise<Object>{
  return new Promise((resolve,reject) => {
    axios({
      url: api.selectList,
      method: 'get',
      params: parameter
   }).then((res:any)=> {
     var result = [];
     for(let i in res) {
       result.push({
         label: res[i]?.roleName,
         value: res[i]?.id
       })
     }
     resolve(result);
   })
  })
}
