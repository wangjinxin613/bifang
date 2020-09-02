import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './core/lazy_use'
import "vue-tsx-support/enable-check";
import global from '@/mixins/global'

import './mock';

Vue.config.productionTip = false

new Vue({
  mixins: [global],
  router,
  store,
  render: h => h(App)
}).$mount('#app')
