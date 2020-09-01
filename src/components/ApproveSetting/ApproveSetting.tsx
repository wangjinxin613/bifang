import { Component } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import './style/index.less';
import { Divider } from 'ant-design-vue';

@Component
export default class extends tsx.Component<Vue> {

  protected render() {
    var list = [1, 2, 3, 4, 5];
    return (
      <div class="approveSetting">
        {
          list.map((item, index) => {
            let icon;
            if(index !== 0) {
              icon = <a-icon type="delete" class="delete" />
            }
            return (
              <div class="box-single">
                <div class="single">
                  <div class="point"></div>
                  <div class="box">
                    <div class="top-view">
                      <div class="title">第{index + 1}节点：{index === 0 ? '发起人' : index === list.length - 1 ? '最终审批人' : '审批人'}</div>
                      <div class="icons">
                        { icon }
                      </div>
                    </div>
                    <div class="content">
                      <div class="setPerson"><a-icon type="setting" class="icon" /> 设置{index === 0 ? '发起人' : index === list.length - 1 ? '最终审批人' : '审批人'} </div>
                    </div>
                  </div>
                  <div class="message-view">
                    <ul class="message">
                      <li><div class="pointer"></div><div class="text">发起人<span>能</span>自选下一节点审批用户</div></li>
                      <li><div class="pointer"></div><div class="text">表单权限 <span>保存 、 撤回 、 编辑 、 删除 、 提醒</span></div></li>
                    </ul>
                    { index == 0 && <div class="notice">注：1、“已保存/已提交/审核中/已退回”的状态下不可删除。 <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2、“已完成”的状态下删除，需要走审批流程。</div>  }
                  
                  </div>
                </div>
                {
                  index !== list.length - 1 && <div class="addNewBtn">
                    <img src={require('@/assets/img/addBtn.png')} />
                  </div>
                }

              </div>
            )
          })
        }
      </div>
    )
  }
}