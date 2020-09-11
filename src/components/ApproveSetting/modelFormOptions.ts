// import { selectList } from '@/api/role';
var selectList: [] = [];

// 第一节点
export const firstOptions : Array<any> = [
  {
    label: '指定角色',
    type: 'select',
    notice: '注：可多选，设置后只能由该指定的角色发起表单。',
    name: 'roles',
    value: [],
    mode:"multiple",
    selectOptions: selectList,
    loading: true
  },
  {
    label: '能否自选下一节点审批用户',
    type: 'radio',
    name: 'ifChoose',
    value: 2,
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
  {
    label: '表单权限',
    type: 'checkbox',
    notice: '注：1、可多选。\n       2、“审批中/已退回”的状态下不可删除。\n       3、“已完成”的状态下删除，需要走审批流程',
    name: 'formAuthority',
    value: [],
    selectOptions: [
      {
        label: '保存',
        value: 3
      },
      {
        label: '撤回',
        value: 4
      },
      {
        label: '编辑',
        value: 2
      },
      {
        label: '删除',
        value: 5
      },
      {
        label: '提醒',
        value: 6
      }
    ]
  },
]

export const secondOptions: Array<any> = [
  {
    label: '指定角色',
    type: 'select',
    notice: '注：可多选，设置后只能由该指定的角色审批表单。',
    name: 'roles',
    value: [],
    mode:"multiple",
    selectOptions: selectList,
    loading: true
  },
  {
    label: '能否自选下一节点审批用户',
    type: 'radio',
    name: 'ifChoose',
    value: 2,
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
  {
    label: '审批类型',
    type: 'select',
    name: 'approveType',
    value: 1,
    selectOptions: [
      {
        label: '一名审批用户通过/退回/否决即可',
        value: 1
      },
      {
        label: '所有审批用户都需通过',
        value: 2
      },
    ]
  },
  {
    label: '表单权限',
    type: 'radio',
    name: 'formAuthority',
    value: 1,
    selectOptions: [
      {
        label: '仅可见',
        value: 1
      },
      {
        label: '可编辑',
        value: 4
      },
    ]
  },
  {
    label: '审批权限',
    type: 'checkbox',
    name: 'approveAuthority',
    value: [],
    notice: '注：1、可多选。\n 2、退回：用户在审批过程中可自选将表单退回到之前任意节点。\n 3、否决：用户在审批过程中将表单否决到表单发起人。',
    selectOptions: [
      {
        label: '退回',
        value: 1
      },
      {
        label: '否决',
        value: 2
      },
    ]
  },
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
    selectOptions: selectList,
    loading: true
  },
  {
    label: '能否自选下一节点审批用户',
    type: 'radio',
    name: 'ifChoose',
    value: 2,
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
  {
    label: '审批类型',
    type: 'select',
    name: 'approveType',
    value: 1,
    selectOptions: [
      {
        label: '一名审批用户通过/退回/否决即可',
        value: 1
      },
      {
        label: '所有审批用户都需通过',
        value: 2
      },
    ]
  },
  {
    label: '审批未到当前节点时，该审批人能否查看本表单',
    type: 'radio',
    name: 'readBefore',
    value: 2,
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
  {
    label: '表单权限',
    type: 'radio',
    name: 'formAuthority',
    value: 1,
    selectOptions: [
      {
        label: '仅可见',
        value: 1
      },
      {
        label: '可编辑',
        value: 4
      },
    ]
  },
  {
    label: '审批权限',
    type: 'checkbox',
    name: 'approveAuthority',
    value: [],
    notice: '注：1、可多选。\n 2、退回：用户在审批过程中可自选将表单退回到之前任意节点。\n 3、否决：用户在审批过程中将表单否决到表单发起人。',
    selectOptions: [
      {
        label: '退回',
        value: 1
      },
      {
        label: '否决',
        value: 2
      },
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
    selectOptions: selectList,
    loading: true
  },
  {
    label: '审批类型',
    type: 'select',
    name: 'approveType',
    value: 1,
    selectOptions: [
      {
        label: '一名审批用户通过/退回/否决即可',
        value: 1
      },
      {
        label: '所有审批用户都需通过',
        value: 2
      },
    ]
  },
  {
    label: '审批未到当前节点时，该审批人能否查看本表单',
    type: 'radio',
    name: 'readBefore',
    value: 2,
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
  {
    label: '表单权限',
    type: 'radio',
    name: 'formAuthority',
    value: [],
    selectOptions: [
      {
        label: '仅可见',
        value: 1
      },
      {
        label: '可编辑',
        value: 4
      },
    ]
  },
  {
    label: '审批权限',
    type: 'checkbox',
    name: 'approveAuthority',
    value: [],
    notice: '注：1、可多选。\n 2、退回：用户在审批过程中可自选将表单退回到之前任意节点。\n 3、否决：用户在审批过程中将表单否决到表单发起人。',
    selectOptions: [
      {
        label: '退回',
        value: 1
      },
      {
        label: '否决',
        value: 2
      },
    ]
  },
]