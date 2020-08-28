/**
 * 定义一些接口
 */

// 表单的某一项
export interface formItem {
  type: 'input' | 'select',   // 表单类型
  label: string,  // 表单的标题
  name: string,  // 表单的name
  value: string,
  selectOptions?: Array<Object> | undefined
}