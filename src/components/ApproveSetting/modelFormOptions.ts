// 第一节点
export const firstOptions : Array<any> = [
  {
    label: '指定角色',
    type: 'select',
    notice: '注：可多选，设置后只能由该指定的角色发起表单。',
    name: 'roles',
    value: [],
    mode:"multiple",
    selectOptions: [
      {
        label: '风控',
        value: '风控'
      },
      {
        label: '财务',
        value: '财务'
      },
    ]
  },
  {
    label: '能否自选下一节点审批用户',
    type: 'radio',
    name: 'ifChoose',
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