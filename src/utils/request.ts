import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import {
  VueAxios
} from './axios'
import {
  ACCESS_TOKEN,
  DEFAULT_API,
} from '@/store/mutation-types'
import { deepCopy } from './util'


// 创建 axios 实例
const service = axios.create({
  baseURL: '/api',
  timeout: 6000000 // 请求超时时间
})

axios.defaults.withCredentials = true

const err = (error: { response: { data: any; status: number } }) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
 
  const token = Vue.ls.get(ACCESS_TOKEN);
  // 接口的地址
  var apiUrl = Vue.ls.get(DEFAULT_API);
  config.baseURL = (process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true') ? process.env
    .VUE_APP_API_BASE_URL : apiUrl;
  if (token) {
    config.headers['token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  // 如果请求的是mock，则多发送一个请求，为了能在network中看到真实的请求情况
  if(config.baseURL === '/mock') {
    var newConfig = deepCopy(config);
    newConfig.baseURL = '/test';
    axios(newConfig);
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  if (response.data.code == 403) {
    if (response.data.payload instanceof Object) {
      Object.keys(response.data.payload).forEach((key) => {
        notification.error({
          message: '无权限',
          description: '您没有' + key + '的' + response.data.payload[key] + '权限！'
        })
      })
    } else if (typeof response.data.payload == 'string') {
      notification.error({
        message: '无权限',
        description: response.data.payload
      })
    }

  }
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue: { use: (arg0: any, arg1: import("axios").AxiosInstance) => void }) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
