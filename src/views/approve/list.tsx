import { Component } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import { formItem } from '@/utils/interface'

@Component
export default class extends tsx.Component<any> {
  
  public searchForm : Array<formItem> = [
    {
      type: 'input',
      label: '审批表单名称',
      name: 'username',
      value: ''
    },
  ]

  public columns = [
    {
       title: '用户名',
       dataIndex: 'user.username'
    },
    {
       title: '姓名',
       dataIndex: 'user.realName',
       
    },
    {
       title: '性别',
       dataIndex: 'user.gender',
    },
    {
       title: '所属角色',
       dataIndex: 'role.roleName',
    },
    {
       title: '联系方式',
       dataIndex: 'user.phone'
    },
    {
       title: '工号',
       dataIndex: 'user.workNumber',
    },
    {
       title: '部门职位',
       dataIndex: 'user.department',
    },
    {
       title: '操作',
       scopedSlots: { customRender: 'action' },
       see: (record: any) => {
          this.$router.push({
             path: 'see/'+ record.user.id
          })
       },
       edit: (record: any) => {
          this.$router.push({
             path: 'edit/'+ record.user.id
          })
       },
       del: true
    },
  ]

  protected render() {
  }

}