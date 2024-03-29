import Vue from 'vue'
import App from './App.vue'

import store from './store'
import './core/lazy_use'
import "vue-tsx-support/enable-check";
import global from '@/mixins/global'
import bus from '@/utils/bus';
import './mock';

import router from './router'


Vue.config.productionTip = false
Vue.prototype.$bus = bus; 

new Vue({
  mixins: [global],
  router,
  store,
  render: h => h(App)
}).$mount('#app')
