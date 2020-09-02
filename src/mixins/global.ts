/**
 * 全局混入
 */

import { Vue, Component } from 'vue-property-decorator'

export default Vue.extend({
  data() {
    return {
     
    }
  },
  methods: {
    handleSync(key: any, value: any) {
      this.$set(this, key, value)
    }
  }
})
