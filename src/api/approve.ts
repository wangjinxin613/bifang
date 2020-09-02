import {
  axios
} from '@/utils/request'

export const api = {
  list: '/activity/getApproveList',
}

export function list(parameter?: Object) {
  return axios({
     url: api.list,
     method: 'get',
     params: parameter
  })
}

// export function passOrReject(parameter) {
//   return axios({
//      url: api.passOrReject,
//      method: 'post',
//      params: parameter
//   })
// }