import { Component } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import { formItem } from '@/utils/interface'
import { list } from '@/api/approve';
import './style.less';

@Component
export default class extends tsx.Component<Vue> {

  public api = list;

  public searchForm: Array<formItem> = [
    {
      type: 'select',
      selectOptions: [{
        label: '采购订单',
        value: '采购订单'
      }, {
        label: '采购合同',
        value: '采购合同'
      }],
      label: '审批表单名称',
      name: 'username',
      value: '采购订单'
    },
  ]

  // 字段审批流的模板
  private get flowTemplate() {
    const list = [0, 1, 2, 3, 4, 8, 9 ];
    return (
      <div class="flowList">
        {list.map((item, index) => {
          return (
            <div class="flowList">
              <div class="single">
                <div class="role">销售（发起人）</div>
                <div class="next-icon">
                  { index !== list.length - 1 ? <img src={require('@/assets/img/flow-next.png')} /> : '' }
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  public columns = [
    {
      title: '审批表单名称',
      dataIndex: 'name',
      width: 150
    },
    {
      title: '审批流类型',
      dataIndex: 'name',
      width: 150
    },
    {
      title: '审批流',
      dataIndex: 'flow',
      customRender: (text: any, row: any, index: any) => {
        return {
          children: this.flowTemplate,
        }
      }
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'action' },
      see: (record: any) => {
        this.$router.push({
          path: 'detail?id=' + record.id
        })
      },
      del: true
    },
  ]

  mounted() {
    // list().then(res => {
    //   console.log(res);
    // })
  }

  protected render() {
  }

}