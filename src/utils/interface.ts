/**
 * 定义接口
 */

import { FormItem } from 'ant-design-vue/types/form/form-item';
import { formPageTypeEnum as pageTypeEnum } from '@/utils/enum';

// 表单的配置项
export interface formItem {
  type: 'input' | 'select' | 'number' | 'textarea' | 'date' | 'dateRange' | 'password' | 'file' | 'customer' | 'money',   // 表单类型
  label: string,  // 表单的标题
  name: string | [],  // 表单的name
  value: string | [] | Function,
  selectOptions?: Array<Object> | undefined | Function,
  selectOptionsCallback?: Function, // 如果selectOption是通过函数调用生成的，这个字段是selectOptions函数的回调函数
  required?: boolean, // 是否必填
  validator?: Object | any, // 自定义校验规则
  disabled?:  Array<pageTypeEnum>,
  readonly?: boolean,
  prefix?: string, // 表单前置修饰文字
  suffix?: string, // 表单后置修饰后缀
  min?: number, // 最小值
  max?: number, // 最大值
  onChange?: any, // 表单change事件
  width?: number, // 栅栏宽度 1~24的整数，默认为8
  mode?: 'default' | 'multiple' | 'tags' | 'combobox',  // select的mode, 设置 Select 的模式为多选或标签
  render?: any,  // customer模式时的自定义render
  supplyParam?: [{  // 额外要上传数据的字段
    type?: string,
    name: string,
    selectOptions?: Array<any>
  }],
  hide?: Array<pageTypeEnum>, // 哪种页面类型要隐藏这个字段
  loading?: Boolean,  // 字段是否处于刷新中
  filterOption?: any, // 是否根据输入项进行筛选, select独有
  showSearch?: Boolean, // 使单选模式可搜索
  formatter?: Function | string,   // 指定输入框展示值的格式 number独有
  parser?: Function | number,   // 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用
  precision?: number,  // 数据精度
  step?: number | string, // 每次改变步数，可以为小数
  validateStatus?: 'success' | 'warning' | 'error' | 'validating', // 校验状态，如不设置，则会根据校验规则自动生成
  help?: any, // 提示信息，如不设置，则会根据校验规则自动生成
  extra?: any, // 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个
  validateTrigger?: 'change' | 'blur' | 'focus' // 校验规则触发条件
}

// 审批流设置的某一项
export interface approveSettingItem {
  readBefore?: number; //审批未到当前节点时，该审批人能查看本表单
  approveAuthority?: number[],  // 审批权限 1 和 2
  approveType?: number, // 审批类型 传个0
  formAuthority?: Array<number>,  // 表单权限 
  ifChoose?: number, // 能否自选下一节点审批用户 
  roles?: [], // 角色 多个角色
  userTaskId?: number, // 跟 additionalProp1 是一个值
  key?: number
}

// form模板对外暴露的属性
export interface formModel {
  loadDataAfter: any;
  submitBefore: Function, // 提交前处理
  createApi: Function, // 创建表单的提交接口函数
  updateApi: Function, // 更新表单的提交接口函数
  detailApi: Function, // 详情页的获取数据接口函数
  deleteApi: Function, // 删除事件的接口函数
  formOption: Array<FormItem>,  // 表单的配置项集合
  submitCallback: Function, // 提交表单成功后的回调函数 创建和更新都会调用这一函数
  getCallback: Function,  // detailApi获取数据成功后的回调函数
  resetForm: Function,  // 重置表单的回调函数
  deleteCallback: Function
}

// 列表模板对外暴露的属性
export interface listModel {
  searchForm?: Array<formItem>, // 搜索表单项
  columns?: Array<any> | any, // 表格的字段配置项
  api: Function, // 获取列表的接口
  deleteApi?: Function, // 删除某行数据的接口函数
  customCreateBtn?: any,  // 自定义创建按钮
  setParameter?: Function,  // 获取列表接口设置参数
}

export interface bfConfig {
  dateFormat?: 'timeStamp' | 'longTimeStamp' | 'string',
  validateTrigger?: 'change' | 'blur' | 'focus'
}