/**
 * 定义一些接口
 */

// 表单的某一项
export interface formItem {
  type: 'input' | 'select' | 'number' | 'textarea' | 'date' | 'dateRange' | 'password' | 'file' | 'customer',   // 表单类型
  label: string,  // 表单的标题
  name: string,  // 表单的name
  value: string | [],
  selectOptions?: Array<Object> | undefined,
  required?: boolean, // 是否必填
  extra?: string, // 下边额外的展示信息
  validator?: Object, // 验证
  disabled?: boolean,
  readonly?: boolean,
  prefix?: string, // 表单前置修饰文字
  suffix?: string, // 表单后置修饰后缀
  min?: number, // 最小值
  max?: number, // 最大值
  onChange?: any, // 表单change事件
  width?: number, // 栅栏宽度 1~24的整数，默认为8
  mode?: string,  // select的mode
  render?: any   // customer模式时的自定义render
}

// 审批流设置的某一项
export interface approveSettingItem {
  approveAuthority?: string,  // 审批权限 1 和 2
  approveType?: number, // 审批类型 传个0
  formAuthority?: number,  // 表单权限 
  ifChoose?: number, // 能否自选下一节点审批用户 
  roles?: string, // 角色 多个角色
  userTaskId?: number, // 跟 additionalProp1 是一个值
  key?: number
}