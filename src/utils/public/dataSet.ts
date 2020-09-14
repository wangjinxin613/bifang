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
export async function get(this: any, apiUrl: string , params: any ) {
  return axios({
    url: apiUrl,
    method: 'get',
    params: params
  })
}