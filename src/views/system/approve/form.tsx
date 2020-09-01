import { Component } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import { formItem } from '@/utils/interface'
import approveSetting from '@/components/ApproveSetting/ApproveSetting';
import { list } from '@/api/approve';
import './style.less';

@Component({
  components: { approveSetting }
})
export default class extends tsx.Component<Vue> {
  
  private get customerRender() {
    return (
      <div style="display: flex">
        <div class="label" style="padding-left: 20px">审批流设置</div>
        <div class="right-view" style="margin-left: 30px">
          <approveSetting></approveSetting>
        </div>
      </div>
    )
  }

  public formOption: Array<formItem> = [
    {
      type: 'select',
      value: '',
      label: '审批表单',
      name: 'shenpi',
      required: true,
      selectOptions: [
        {
          label: '采购订单',
          value: '采购订单'
        }
      ],
      width: 8
    },
    {
      type: 'select',
      value: '',
      label: '复制审核流程',
      name: 'shenpi',
      selectOptions: [
        {
          label: '采购订单',
          value: '采购订单'
        }
      ],
    },
    {
      type: 'customer',
      value: '',
      name: '',
      label: '审批流设置',
      width: 8,
      render: this.customerRender
    }
  ]

  protected render() {
  }
  
}