// import Vue from 'vue'

import './components_use'
import Vue from 'vue';
import VueStorage from 'vue-ls'
import { DEFAULT_API } from '@/store/mutation-types'
import config from '../config/defaultSettings';
Vue.use(VueStorage, config.storageOptions)

// antd-ui style
import 'ant-design-vue/dist/antd.less';
// import '../assets/style/base.less';

/**
 * 初始化一些数据
 */ 
Vue.ls.set(DEFAULT_API, Vue.ls.get(DEFAULT_API, process.env.VUE_APP_API_BASE_URL)) 