/**
 * 定义接口
 */

import { FormItem } from 'ant-design-vue/types/form/form-item';
import { formPageTypeEnum as pageTypeEnum } from '@/utils/enum';

// 表单的配置项
export interface formItem {
  type: 'input' | 'select' | 'number' | 'textarea' | 'date' | 'dateRange' | 'password' | 'file' | 'customer',   // 表单类型
  label: string,  // 表单的标题
  name: string | any,  // 表单的name
  value: string | [] | Function,
  selectOptions?: Array<Object> | undefined | Function,
  selectOptionsCallback?: Function, // 如果selectOption是通过函数调用生成的，这个字段是selectOptions函数的回调函数
  required?: boolean, // 是否必填
  extra?: string, // 下边额外的展示信息
  validator?: Object | any, // 自定义校验规则
  disabled?: boolean,
  readonly?: boolean,
  prefix?: string, // 表单前置修饰文字
  suffix?: string, // 表单后置修饰后缀
  min?: number, // 最小值
  max?: number, // 最大值
  onChange?: any, // 表单change事件
  width?: number, // 栅栏宽度 1~24的整数，默认为8
  mode?: string,  // select的mode
  render?: any,  // customer模式时的自定义render
  supplyParam?: [{
    type?: string,
    name: string,
    selectOptions?: Array<any>
  }],
  hide?: Array<pageTypeEnum>, // 哪种页面类型要隐藏这个字段
  loading?: Boolean  // 字段是否处于刷新中
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
  submitcallback: Function, // 提交表单成功后的回调函数 创建和更新都会调用这一函数
  getCallback: Function,  // detailApi获取数据成功后的回调函数
}