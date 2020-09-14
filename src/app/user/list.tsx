import { list, del, allApprove, selectList } from '@/api/approve';
import './style.less';

export const approveIdSelect = allApprove;

// 审批流类型
export function ifDeleteRender(text: any, row: any, index: any) {
  return {
    children: (text: number) => {
      if (text == 1) {
        return <span style="color: #FF7979">删除表单审批流</span>
      }
      return <span style="color: #4890F7">创建表单审批流</span>
    }
  }
}

// 审批流
export function roleListFlowRender(text: any, row: any, index: any) {
  return {
    children: (text: any) => {
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
    },
  }
}

export function see(this: any, record: any) {
  if(record.ifDelete == 1) {
    this.$router.push({
      path: '/system/approveDel/detail/' + record.id
    })
  } else {
    this.$router.push({
      path: 'detail/' + record.id
    })
  }
}