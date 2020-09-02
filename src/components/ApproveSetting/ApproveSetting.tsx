import { Component, PropSync, Prop, Watch, Emit } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import './style/index.less';
import customModel from '@/components/CustomModel/approveSettingModel';
import { firstOptions } from './modelFormOptions';
import { approveSettingItem } from '@/utils/interface'
import { List } from 'ant-design-vue';

// 定义节点类型，分别为发起人节点、审批人节点、最终审批人节点。不同节点有不同的模板
enum nodeType {
  first = 'first',
  middle = 'middle',
  last = 'last'
}
@Component({
  components: { customModel }
})
export default class extends tsx.Component<Vue> {

  // 从父组件接收到的审批流列表
  @Prop({
    type: Array,
    default: () => []
  }) public flowList!: Array<approveSettingItem>;

  // 组件内的审批流列表 为了解耦
  public list: Array<approveSettingItem> = [];

  public showModel = false;
  public modelTitle = '';
  public formOptions: Array<any> = [];
  public activeIndex: number = 0; // 当前正在设置的审批项的index 

  // 点击设置审批人
  public setPerson(index: number, list: Array<any>) {
    // 第一节点
    if (index === 0) {
      this.formOptions = firstOptions;
      this.$nextTick(() => {
        this.showModel = true;
      })
    } else if(index === list.length - 1) {
      // 最后一个节点
    }
    this.activeIndex = index;
    this.modelTitle = `设置第${index + 1}节点`
  }

  get id() {
    return this.$route.params.id;
  }

  public handleSync(key: any, value: any) {
    this.$set(this, key, value)
  }

  // 点击设置节点表单提交按钮，更新数据项
  public formSubmit(value: Object) {
    Object.assign(this.list[this.activeIndex], value)
    this.showModel = false;
  }

  // 获取表单权限的命名
  public getFormRoleName(value: number) {
    return value;
  }

  // 获取审批权限的命名
  public getApproveRoleName(value: number[]) {
    return value;
  }

  protected mounted() {
    // 创建页生成一个默认的审批流
    if (this.id === 'create') {
      this.list = [{}, {}, {}, {}];
    }
  }

  protected render() {
    var list = this.list;
    return (
      <div class="approveSetting">
        {
          list.map((item, index) => {
            let icon;
            if (index !== 0) {
              icon = <a-icon type="delete" class="delete" />
            }
            return (
              <div class={['box-single', index === list.length - 1 && index !== 0 ? 'last' : '']}>
                <div class="single">
                  <div class="point"></div>
                  <div class="box">
                    <div class="top-view">
                      <div class="title">第{index + 1}节点：{index === 0 ? '发起人' : index === list.length - 1 ? '最终审批人' : '审批人'}</div>
                      <div class="icons">
                        {icon}
                      </div>
                    </div>
                    <div class="content">
                      <div class="setPerson" onClick={this.setPerson.bind(this, index, list)}><a-icon type="setting" class="icon" /> 设置{index === 0 ? '发起人' : index === list.length - 1 ? '最终审批人' : '审批人'} </div>
                    </div>
                  </div>
                  <div class="message-view">
                    <ul class="message">
                      {
                        (() => {
                          let temp = [];
                          if(typeof item.ifChoose != 'undefined') {
                            temp.push(<div class="text">发起人<span>{ item.ifChoose == 1 ? '能' : '不能' }</span>自选下一节点审批用户</div>)
                          } if(typeof item.approveType != 'undefined') {
                            temp.push(<div class="text">审批类型：<span>{ item.approveType == 1 ? '一名审批用户通过/退回/否决即可' : '所有审批用户都需通过' }</span></div>)
                          } if (Array.isArray(item.formAuthority) && item.formAuthority.length > 0 ) {
                            temp.push(<div class="text">表单权限：<span>{ this.getFormRoleName(item.formAuthority) }</span></div>)
                          } if(Array.isArray(item.approveAuthority) && item.approveAuthority.length > 0 ) {
                            temp.push(<div class="text">审批权限：{ this.getApproveRoleName(item.approveAuthority) }</div>)
                          }
                          return temp.map(current => <li><div class="pointer"></div>{current}</li> )
                        })()
                      }
                    </ul>
                    {index == 0 && <div class="notice">注：1、“已保存/已提交/审核中/已退回”的状态下不可删除。 <br />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2、“已完成”的状态下删除，需要走审批流程。</div>}
                  </div>
                </div>
                {
                  (index !== list.length - 1 || index == 0) && <div class="addNewBtn">
                    <img src={require('@/assets/img/addBtn.png')} />
                  </div>
                }
              </div>
            )
          })
        }
        {/* 设置第一节点 */}
        <customModel
          theme="blue"
          formOptions={this.formOptions}
          show={this.showModel}
          title={this.modelTitle}
          on={{ ['update:show']: this.handleSync.bind(this, 'showModel'), submit: this.formSubmit }} >
        </customModel>
      </div>
    )
  }
}