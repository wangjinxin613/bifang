module.exports = {
  /**
   *  日期转化格式，所有的涉及到日期的字段与后端交互时自动转换的格式，可选项如下：
   *  timeStamp(10位时间戳)、longTimeStamp(13位时间戳)、string(字符串，如2020-10-01)
   **/ 
  dateFormat: 'timeStamp', 
  /**
   * 表单的验证规则触发条件
   */
  validateTrigger: 'change'
}