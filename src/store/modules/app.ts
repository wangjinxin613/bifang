import Vue from 'vue'
import { DEFAULT_API } from '../mutation-types';

const app = {
  state: {
    defaultApi: '',
  },
  mutations: {
    SET_DEFAULT_API: (state: { defaultApi: any }, api: any) => {
      // state.defaultApi = api
      // Vue.ls.set(DEFAULT_API, api)
    },
  },
}

export default app
