/**
 * 设置项
 */
import { mapState } from 'vuex'
import { DEFAULT_API } from '@/store/mutation-types'
import Vue from 'vue';

export default {
  data() {
    return {
      
    }
  },
  computed: {
    defaultApi() {
      return Vue.ls.get(DEFAULT_API)
    }
  },
  methods:{
    setDefaultApi(api: any) {
      Vue.ls.set(DEFAULT_API, api);
    }
  }
}


