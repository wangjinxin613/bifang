import { Component, Ref } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import { formItem } from '@/utils/interface'
import approveSetting from '@/components/ApproveSetting/ApproveSetting';
import { list, worksList, create } from '@/api/approve';
import './style.less';
import { approveSettingItem } from '@/utils/interface'
@Component({
  components: { approveSetting },
})
export default class extends tsx.Component<Vue> {

  @Ref() approveModel: any;
  public createApi = create;
  public list: Array<approveSettingItem> = [{}];

  public handleSync(key: any, value: any) {
    this.$set(this, key, value)
    console.log(key,value);
    this.$forceUpdate()
  }

  public submitBefore(fieldsValue: Object) {
    // 审批流设置项
    var { list: approveList } = this.approveModel;
    
    // 校验审批流填的对不对
    if(!Array.isArray(approveList) || approveList.length == 0) {
      this.$message.error('请至少设置一个审批流节点')
      return;
    }
    for(let i in approveList) {
      if(typeof approveList[i].roles == 'undefined') {
        this.$message.error('您还没有设置第' + (Number(i) + 1) + '节点');
        return;
      }
    }
    // 将approveList拼接成后端的格式
    var details = {};
    approveList.map((item, index: number) => {
      let key = String(index + 1);
      // 数组类型的字段转换成字符串逗号分割
      Object.keys(item).forEach((current) => {
        if(Array.isArray(item[current]) ) {
          item[current] = item[current].join(',');
        }
      })
      item.userTaskId = key;
      if(typeof item.ifChoose == 'undefined' ) {
        item.ifChoose = 2;
      }
      Object.assign(details, {
        [key] : item
      })
    })
    Object.assign(fieldsValue, {
      details: details,
      userId: 1
    })
    return fieldsValue;
  }

  protected mounted() {
   
  }
  
  private get customerRender() {
    return (
      <div style="display: flex;margin-bottom: 20px">
        <div class="label" style="padding-left: 0px;">审批流设置</div>
        <div class="right-view" style="margin-left: 30px">
          <approveSetting ref="approveModel" flowList={ this.list } on={{ ['update:flowList']: this.handleSync.bind(this, 'list') }} ></approveSetting>
        </div>
      </div>
    )
  }

  public formOption: Array<formItem> = [
    {
      type: 'select',
      value: '',
      label: '审批表单名称',
      name: 'worksId',
      required: true,
      selectOptions: worksList,
      width: 8,
      supplyParam: [
        {
          type: 'select',
          name: 'processId'
        }
      ]
    },
    {
      type: 'select',
      value: '',
      label: '复制审核流程',
      name: '',
      selectOptions: [
        {
          label: '不复制',
          value: '不复制'
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
    },
    {
      type: 'textarea',
      value: '',
      label: '审批说明',
      name: 'describe',
      width: 18
    },
  ]

  protected render() {
  }
  
}