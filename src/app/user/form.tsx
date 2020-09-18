import { get } from '@/utils/public/dataSet';
import approveSetting from '@/components/ApproveSetting/ApproveSetting';
import { approveSettingItem, formModel } from '@/utils/interface'

export default {
  components: { approveSetting },
  data() {
    return {
      flowList: [],
    }
  },
  worksIdSelectOptionsCallback(res: any, apiData: any) {
    res.push({
      label: apiData.activityId,
      value: apiData.workId
    })
    return res;
  },
  copyFlowOnChange(this:any, value: string, params: any) {
    const { label } = params;
    (this as any).$confirm({
      title: '确定要复制' + label + '的审核流程吗?',
      content: '目前设置的审批流程将会被替换',
      onOk: () => {
        const hide = (this as any).$message.loading('正在复制中，请稍后', 0);
        this.detailApi({
          id: value
        }).then((res: any) => {
          // (this as any).formData = {describe: res.describtion};
          this.loadDataAfter.call(this, res);
          hide();
        })
      },
      onCancel: () => {
        (this as any).$parent.formData = { copyFlow: '' };
        (this as any).$forceUpdate();
      },
    });
  },
  customerRender(this: any) {
    return (
      <div style="display: flex;margin-bottom: 20px">
        <div class="label" style="padding-left: 0px;">审批流设置</div>
        <div class="right-view" style="margin-left: 30px">
          <approveSetting ref="approveModel" flowList={this.flowList} ></approveSetting>
        </div>
      </div>
    )
  },
  methods: {
    submitBefore(this: any, fieldsValue: Object) {
      // 审批流设置项
      var { list: approveList } = this.$refs['approveModel'];
      // 校验审批流填的对不对
      if (!Array.isArray(approveList) || approveList.length == 0) {
        this.$message.error('请至少设置一个审批流节点')
        return;
      }
      for (let i in approveList) {
        if (typeof approveList[i].roles == 'undefined') {
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
          if (Array.isArray(item[current])) {
            item[current] = item[current].join(',');
          }
        })
        item.userTaskId = key;
        if (typeof item.ifChoose == 'undefined') {
          item.ifChoose = 2;
        }
        Object.assign(details, {
          [key]: item
        })
      })
      Object.assign(fieldsValue, {
        details: details,
        userId: 1,
        ifDelete: 2
      })
      return fieldsValue;
    },
    getCallback(res: any) {
      Object.assign(res, {
        describe: res.describtion,
        worksId: res.workId
      })
    },
    loadDataAfter(this: any, res: any) {
      console.log(99998);
      var list: Array<approveSettingItem> = [];
      Object.keys(res.details).forEach((index: string) => {
        let item = res.details[index];
        // 某些字段需要转换成数组或数字
        Object.keys(item).forEach((key: string) => {
          if (['roles', 'formAuthority', 'approveAuthority'].indexOf(key) != -1) {
            if (!(key == 'formAuthority' && (item[key] == 1 || item[key] == 4))) {   // 仅可见和可编辑的情况下是单选
              item[key] = item[key]?.split(',').map((current: number) => !isNaN(current) && Number(current));
            }
          }
          if (!Array.isArray(item[key]) && !isNaN(item[key])) {
            item[key] = Number(item[key])
          }
        })
        list.push(item);
      })
      this.flowList = list;
      try {
        this.$refs.approveModel.list = list;
      } catch (error) {
      }
    },
    submitCallback(this: any, res: any, fieldsValue: any) {
      if (res.code == 200) {
        this.$success({
          title: '提交成功',
          okText: '知道了',
          onOk: () => {
            this.$router.push({
              path: '/system/approve/list'
            });
          }
        });
      } else {
        this.$message.error(res.payload ?? '发生未知错误');
      }
      this.loadDataAfter(fieldsValue);
    },
    resetForm(this: any) {
      this.flowList = [{}, {}, {}, {}]
      this.$refs.approveModel.list = [{}, {}, {}, {}]
    }
  },
}