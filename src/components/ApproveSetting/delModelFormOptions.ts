import { selectList } from '@/api/role';

// 第一节点
export const firstOptions : Array<any> = [
  {
    label: '指定角色',
    type: 'select',
    notice: '注：可多选，设置后只能由该指定的角色发起表单。',
    name: 'roles',
    value: [],
    mode:"multiple",
    selectOptions: selectList
  }
]

export const secondOptions: Array<any> = [
  {
    label: '指定角色',
    type: 'select',
    notice: '注：可多选，设置后只能由该指定的角色审批表单。',
    name: 'roles',
    value: [],
    mode:"multiple",
    selectOptions: selectList
  }
]

/**
 * 中间节点
 */
export const middleOptions : Array<any> = [
  {
    label: '指定角色',
    type: 'select',
    notice: '注：可多选，设置后只能由该指定的角色审批表单。',
    name: 'roles',
    value: [],
    mode:"multiple",
    selectOptions: selectList
  },
  {
    label: '审批未到当前节点时，该审批人能否查看本表单',
    type: 'radio',
    name: 'readBefore',
    value: 1,
    selectOptions: [
      {
        label: '能',
        value: 1
      },
      {
        label: '不能',
        value: 2
      }
    ]
  },
]

/**
 * 最后一个节点
 */
export const lastOptions : Array<any> = [
  {
    label: '指定角色',
    type: 'select',
    notice: '注：可多选，设置后只能由该指定的角色审批表单。',
    name: 'roles',
    value: [],
    mode:"multiple",
    selectOptions: selectList
  },
  {
    label: '审批未到当前节点时，该审批人能否查看本表单',
    type: 'radio',
    name: 'readBefore',
    value: 1,
    selectOptions: [
      {
        label: '能',
        value: 1
      },
      {
        label: '不能',
        value: 2
      }
    ]
  },
]