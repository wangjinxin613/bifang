/**
 * 这里是公共指令的函数实现
 * 数据集相关的
 */
import {
  axios
} from '@/utils/request'

// export const name = '';

/**
 * 发起一个get请求
 * @apiUrl get请求的地址
 * @params get请求的参数
 */
export async function get(this: any, apiUrl: string, params?: any ) {
  return axios({
    url: apiUrl,
    method: 'get',
    params: params
  })
}

/**
 * 发起一个post请求
 * @param apiUrl 
 * @param params 
 */
export async function post(this: any, apiUrl: string, params?: any ) {
  return axios({
    url: apiUrl,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 发起一个put请求
 * @param apiUrl 
 * @param params 
 */
export async function put(this: any, apiUrl: string, params?: any ) {
  return axios({
    url: apiUrl,
    method: 'put',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 获取一个选择框的列表项
 * @param apiUrl 
 * @param params 
 */
export async function select(apiUrl: string, labelName: string, idName: string = 'id', params: string){
  var result = [];
  var res: any = await get(apiUrl, params);
  if(!Array.isArray(res)) {
    if(Array.isArray(res.list)) res = res.list;
  }
  for (let i in res) {
    result.push({
      label: res[i][labelName],
      value: res[i][idName]
    })
  }
  return result;
}