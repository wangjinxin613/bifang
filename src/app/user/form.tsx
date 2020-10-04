import { get } from '@/utils/public/dataSet';

export default {
  usernameRule(this: any, rule: any, value: any, callback: Function) {
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    if(!/^\w\w{3,11}$/.test(value)) {
      callback('用户名必须为4-12为字母或数字')
    }
    callback();
  },
  change() {
    console.log(arguments);
  },
  ageFormatter(value: any) {
    return `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}