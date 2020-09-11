import { Component } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import { formItem } from '@/utils/interface'
import { list, del, allApprove } from '@/api/approve';
import './style.less';

@Component
export default class extends tsx.Component<Vue> {

  public api = list;
  public deleteApi = del; 

  public searchForm: Array<formItem> = [
    {
      type: 'select',
      selectOptions: allApprove,
      label: '审批表单名称',
      name: 'approveId',
      value: ''
    },
  ]

  // 字段审批流的模板
  private flowTemplate(text: any) {
    if (typeof text == 'object') {
      var list: any[] = [];
      Object.keys(text).forEach((key: string, index, item: any) => {
        list.push(text[key]);
      })
      return (
        <div class="flowList">
          {list.map((item, index) => {
            return (
              <div class="flowList">
                <div class="single">
                  <a-tooltip title={item.join('、')} placement="bottom">
                    <div class="role">{item.join('、')}</div>
                  </a-tooltip>
                  <div class="next-icon">
                    {index !== list.length - 1 ? <img src={require('@/assets/img/flow-next.png')} /> : ''}
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )
    }
    return '-';
  }

  // 自定义新建按钮
  public get customCreateBtn() {
    return (
      <a-dropdown trigger={['click']}>
        <a-button type="primary" class="createBtn ant-dropdown-link" icon="file-add">
          新建
        </a-button>
        <a-menu slot="overlay">
          <a-menu-item key="0">
            <router-link to="form/create">创建表单审批流</router-link>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="1">
            <router-link to="../approveDel/form/create">删除表单审批流</router-link>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    )
  }

  // 审批流类型
  public approveType(text: any) {
    if (text == 1) {
      return <span style="color: #FF7979">删除表单审批流</span>
    }
    return <span style="color: #4890F7">创建表单审批流</span>
  }

  public columns = [
    {
      title: '审批表单名称',
      dataIndex: 'approveName',
      width: 150
    },
    {
      title: '审批流类型',
      dataIndex: 'ifDelete',
      width: 150,
      customRender: (text: any, row: any, index: any) => {
        return {
          children: this.approveType(text)
        }
      }
    },
    {
      title: '审批流',
      dataIndex: 'roleListFlow',
      customRender: (text: any, row: any, index: any) => {
        return {
          children: this.flowTemplate(text),
        }
      }
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'action' },
      see: (record: any) => {
        if(record.ifDelete == 1) {
          this.$router.push({
            path: '/system/approveDel/detail/' + record.id
          })
        } else {
          this.$router.push({
            path: 'detail/' + record.id
          })
        }
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