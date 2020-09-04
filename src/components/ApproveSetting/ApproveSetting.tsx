import { Component, PropSync, Prop, Watch, Emit } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import './style/index.less';
import customModel from '@/components/CustomModel/approveSettingModel';

import { approveSettingItem } from '@/utils/interface'
import { selectList } from '@/api/role';
import { setValue, deepCopy } from '@/utils/util';
import { formPageTypeEnum as pageTypeEnum } from '@/utils/enum';

// 定义节点类型，分别为发起人节点、审批人节点、最终审批人节点。不同节点有不同的模板
enum nodeType {
  first = 'first',
  middle = 'middle',
  last = 'last'
}
// 定义审批模态窗主题
enum theme {
  blue = 'blue',
  orange = 'orange',
  pink = 'pink'
}
@Component({
  components: { customModel }
})
export default class extends tsx.Component<Vue> {

  @Prop({
    type: Boolean,
    default: false
  }) public isDelete!: Boolean; // 是否是删除审批流设置

  // 从父组件接收到的审批流列表
  @Prop({
    type: Array,
    default: () => []
  }) public flowList!: Array<approveSettingItem>;

  @Watch('flowList', {deep: true, immediate: true})
  public watchFlowList(newValue: any) {
    console.log("flowList发生变化", newValue);
    this.list = newValue;
  }

  // 组件内的审批流列表 为了解耦
  public list: Array<approveSettingItem> = [];

  public showModel = false;
  public modelTitle = '';
  public formOptions: Array<any> = [];
  public theme: theme = theme.blue;
  public activeIndex: number = 0; // 当前正在设置的审批项的index 

  public roleList: any = [];  // 角色列表

  public firstOptions! : any;
  public middleOptions! : any;
  public lastOptions! : any;
  public secondOptions! : any;

  // 点击设置审批人
  public setPerson(index: number, list: Array<any>) {
    var  { firstOptions, middleOptions, lastOptions, secondOptions }  = this;
    // 第一节点
    if (index === 0) {
      this.formOptions = setValue(firstOptions, list[index]);
      this.theme = theme.blue;
    } else if (index === list.length - 1) {
      // 最后一个节点
      this.theme = theme.pink;
      this.formOptions = setValue(lastOptions, list[index]);
    } else if(index == 1) {
      // 第二个节点和中间节点相比没有 【审批未到当前节点时，该审批人能否查看本表单】 这一选项
      this.theme = theme.orange;
      this.formOptions = setValue(secondOptions, list[index]);
    } else {
      // 中间节点
      this.theme = theme.orange;
      this.formOptions = setValue(middleOptions, list[index]);
    }
    this.showModel = true;
    this.activeIndex = index;
    this.modelTitle = `设置第${index + 1}节点`
  }

  // 添加新节点
  public addNewNode(index: number) {
    this.list.splice(index + 1, 0, {})
    this.$nextTick(() => {
      this.setPerson(index + 1, this.list);
    })
  }

  // 删除某节点
  public deleteNode(index: number) {
    this.list.splice(index, 1);
  }

  get id() {
    return this.$route.params.id;
  }

  public get pageType() {
    const { path } = this.$route;
    if (this.id == 'create' || isNaN(Number(this.id))) {
      return pageTypeEnum.create;
    } else if (path.indexOf('detail') != -1) {
      return pageTypeEnum.detail;
    } else {
      return pageTypeEnum.update;
    }
  }

  public handleSync(key: any, value: any) {
    this.$set(this, key, value)
  }

  // 获取角色名
  public getRoleName(roles: Array<number>) {
    if (Array.isArray(roles)) {
      var roleNames: string[] = [];
      this.roleList.map((item: any) => {
        if (roles.indexOf(Number(item.value)) != -1) {
          roleNames.push(item.label)
        }
      })
      return roleNames.join('、');
    }
  }

  // 点击设置节点表单提交按钮，更新数据项
  public formSubmit(value: Object) {
    Object.assign(this.list[this.activeIndex], value)
    this.showModel = false;
  }

  // 获取表单权限的命名
  public getFormRoleName(value: Array<number> | number, index: number) {
    var result = [];
    if (index == 0 && Array.isArray(value)) {
      for (let i in this.firstOptions[2].selectOptions) {
        if (value.indexOf(this.firstOptions[2].selectOptions[i].value) != -1) {
          result.push(this.firstOptions[2].selectOptions[i].label);
        }
      }
    } else {
      result.push(value == 1 ? '仅可见' : '可编辑')
    }
    return result.join('、');
  }

  // 获取审批权限的命名
  public getApproveRoleName(value: number[]) {
    var selectOptions = this.middleOptions[this.middleOptions.length - 1].selectOptions;
    var result = [];
    for (let i in selectOptions) {
      if (value.indexOf(selectOptions[i].value) != -1) {
        result.push(selectOptions[i].label);
      }
    }
    return result.join('、');
  }

  protected mounted() {
    // 创建页生成一个默认的审批流
    if (this.id === 'create') {
      this.list = [{}, {}, {}, {}];
    }
    selectList().then(res => {
      this.roleList = res;
    })
    var options = require('./modelFormOptions');
    if(this.isDelete) {
      var options = require('./delModelFormOptions');
    }
    var  { firstOptions, middleOptions, lastOptions, secondOptions }  = options;
    this.firstOptions = firstOptions;
    this.middleOptions = middleOptions;
    this.lastOptions = lastOptions;
    this.secondOptions = secondOptions;
  }

  protected render() {
    var list = this.list;
    return (
      <div class="approveSetting">
        {
          list.map((item, index) => {
            let icon = [];
            if ((Array.isArray(item.roles) && item.roles.length > 0) && this.pageType !== pageTypeEnum.detail) {
              icon.push(<a-icon type="form" class="editIcon" onClick={this.setPerson.bind(this, index, list)} />)
            }
            if (index !== 0 && this.pageType !== pageTypeEnum.detail) {
              icon.push(<a-popconfirm
                title="确定要删除这个节点吗?"
                ok-text="确定"
                cancel-text="不了"
                on-confirm={this.deleteNode.bind(this, index)}
              ><a-icon type="delete" class="delete" /></a-popconfirm>)
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
                      {
                        (Array.isArray(item.roles) && item.roles.length > 0) ? (
                          <div class="roleList">
                            <img src={require('@/assets/img/person.png')} />
                            <span>{this.getRoleName(item.roles)}</span>
                          </div>
                        ) : (
                          this.pageType !== pageTypeEnum.detail &&
                            <div class="setPerson" onClick={this.setPerson.bind(this, index, list)}><a-icon type="setting" class="icon" /> 设置{index === 0 ? '发起人' : index === list.length - 1 ? '最终审批人' : '审批人'} </div>
                          )
                      }
                    </div>
                  </div>
                  <div class="message-view">
                    {
                      (() => {
                        let temp = [];
                        if (typeof item.ifChoose != 'undefined') {
                          temp.push(<div class="text">发起人<span>{item.ifChoose == 1 ? '能' : '不能'}</span>自选下一节点审批用户</div>)
                        } if (typeof item.approveType != 'undefined') {
                          temp.push(<div class="text">审批类型：<span>{item.approveType == 1 ? '一名审批用户通过/退回/否决即可' : '所有审批用户都需通过'}</span></div>)
                        } if (typeof item.readBefore != 'undefined') {
                          temp.push(<div class="text">审批未到当前节点时，该审批人<span>{item.readBefore == 1 ? '能' : '不能'}</span>查看本表单</div>)
                        }
                        if ((Array.isArray(item.formAuthority) && item.formAuthority.length > 0) || (!Array.isArray(item.formAuthority) && item.formAuthority)) {
                          temp.push(<div class="text">表单权限：<span>{this.getFormRoleName(item.formAuthority, index)}</span></div>)
                        } if (Array.isArray(item.approveAuthority) && item.approveAuthority.length > 0) {
                          temp.push(<div class="text">审批权限：<span>{this.getApproveRoleName(item.approveAuthority)}</span></div>)
                        }
                        return (
                          <div>
                            <ul class="message">
                              {temp.map(current => <li><div class="pointer"></div>{current}</li>)}
                            </ul>
                            {(index === 0 && temp.length !== 0) && <div class="notice">注：1、“已保存/已提交/审核中/已退回”的状态下不可删除。 <br />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2、“已完成”的状态下删除，需要走审批流程。</div>}
                          </div>
                        )
                      })()
                    }
                  </div>
                </div>
                {
                  (index !== list.length - 1 || index == 0) && this.pageType !== pageTypeEnum.detail && <div class="addNewBtn" onClick={this.addNewNode.bind(this, index)}>
                    <img src={require('@/assets/img/addBtn.png')} />
                  </div>
                }
              </div>
            )
          })
        }
        {/* 设置节点 */}
        {
          this.showModel && (
            <customModel
              formOptions={this.formOptions}
              show={this.showModel}
              title={this.modelTitle}
              theme={this.theme}
              on={{ ['update:show']: this.handleSync.bind(this, 'showModel'), submit: this.formSubmit }} >
            </customModel>
          )
        }
      </div>
    )
  }
}