import { Vue, Component, Ref } from 'vue-property-decorator'
import * as tsx from "vue-tsx-support";
import '@/assets/style/formView.less';
import { formItem } from '@/utils/interface'

enum pageTypeEnum {
  create = 'create',
  update = 'update'
}

@Component({
})
export default class extends tsx.Component<any> {

  @Ref() content: any;
  public btnLoading: Boolean = false;

  public formOption: Array<formItem> = [];   // 表单配置项(也不一定是表单)

  public get id() {
    return this.$route.params.id;
  }

  // 页面表单类型
  public get pageType() {
    if (this.id == 'create' || isNaN(Number(this.id))) {
      return pageTypeEnum.create;
    } else {
      return pageTypeEnum.update;
    }
  }

  public get formModel() {
    return this.$form.createForm(this)
  }

  // 提交表单事件
  public submit() {
    this.formModel.validateFields(async err => {
      if (!err) {
        var fieldsValue = this.formModel.getFieldsValue();
        const { content } = this;

        const hide = this.$message.loading('正在提交中，请稍后', 0);
        // this.btnLoading = true;

        // 字段赋值处理
        this.formOption.forEach(async (current, index) => {
          if (current.type == 'file' && current.value) {

          } else if (current.type == 'select' && current.supplyParam) {
            current.supplyParam.forEach(item => {
              if (item.type == 'select' && item.name && Array.isArray(current.selectOptions)) {
                current.selectOptions.forEach((symbol: any) => {
                  if (symbol.value == fieldsValue[current.name]) {
                    Object.assign(fieldsValue, {
                      [item.name]: symbol.label
                    });
                  }
                });
              }
            });
          } else if (current.type == 'dateRange') {
            Object.assign(fieldsValue, {
              [current.name[0]]: fieldsValue[current.name[0]][0].unix(),
              [current.name[1]]: fieldsValue[current.name[0]][1].unix()
            });
          }
        })

        // 提交前处理
        if (content.submitBefore && typeof content.submitBefore) {
          fieldsValue = await content.submitBefore(fieldsValue);
          if(!fieldsValue) {
            hide();
            this.btnLoading = false;
            return ;
          }
        }

        // 开始提交调接口
        const deployApi = this.pageType === pageTypeEnum.create ? content.createApi : content.updateApi;
        if (typeof deployApi === 'function') {
          deployApi(fieldsValue).then((res: any) => {
            if (typeof content.callback == 'function') {
              content.callback(res);
            } else {
              if (res.code == 200) {
                this.$success({
                  title: (this.pageType == pageTypeEnum.create ? '添加' : '提交') + '成功',
                  okText: '知道了',
                  onOk: () => {
                    this.$router.push({
                      path: '../list'
                    });
                  }
                });
              } else {
                this.$message.error(res.payload ?? '发生未知错误');
              }
            }
            hide();
            this.btnLoading = false;
          }).catch((res: any) => {
            this.btnLoading = false;
            hide();
            this.$message.error(res.payload ?? '发生未知错误');
         });
        }
      }
    })
  }

  mounted() {
    const { content } = this;
    Object.assign(this, {
      formOption: content.formOption ?? [],
    })
  }

  protected render() {
    return (
      <div>
        <div class="formView">
          <div class="header">
            <div class="title"><a-icon type="file-add" class="icon" />新建（创建表单审批流）</div>
            <div class="reback" onClick={() => this.$router.go(-1)}>返回</div>
          </div>
          <a-form class="form" layout="horizontal" form={this.formModel} >
            <a-row gutter={60} style="width: 100%;">
              {
                this.formOption.map((item, index) => {
                  var formItem;
                  // 输入框
                  if (item.type == 'input') {
                    formItem = <a-input
                      placeholder={'请输入' + item.label}
                      v-decorator={[
                        'test',
                        {
                          rules: [{ required: item.required, message: '请输入' + item.label + '!' }, ...(!item.validator ? [] : item.validator)],
                          initialValue: typeof item.value == 'function' ? item.value(item, index, this.formOption) : item.value,
                          validateTrigger: 'blur',
                          validateFirst: true
                        }
                      ]}
                      disabled={false}
                      readonly={false}
                      name={item.name}
                      type={item.name}
                    // prefix="item.isMoney ? (typeof item.prefix == 'undefined' ? '￥' : item.prefix) : item.prefix"
                    // suffix="item.suffix"
                    // min="item.isMoney ? 0 : item.min"
                    ></a-input>
                  } else if (item.type == 'select') {
                    formItem = <a-select
                      placeholder="请选择"
                      disabled={item.disabled}
                      readonly={item.readonly}
                      v-decorator={[item.name, { rules: [{ required: item.required, message: '请选择' + item.label + '!' }], initialValue: item.value }]}
                      mode={item.mode}
                    // onChange={typeof item.onChange == 'function' ? item.onChange.bind(this, '$event', item) : null}
                    // :filter-option="filterOption"
                    // :show-search="item.showSearch"
                    >
                      {
                        Array.isArray(item.selectOptions) ?
                          item.selectOptions?.map((symbol: any) => (
                            <a-select-option value={symbol.value}>{symbol.label}</a-select-option>
                          )) : (typeof item.selectOptions === 'function') &&
                          (() => {
                            try {
                              item.selectOptions().then((res: any) => {
                                item.selectOptions = res;
                              })
                            } catch (error) {
                              console.error("渲染选择框选项的过程中出现了问题", error);
                            }
                          })()
                      }
                    </a-select>
                  } else if (item.type == 'textarea') {
                    formItem = (
                      <a-textarea
                        placeholder={'请输入' + item.label}
                        v-decorator={[
                          item.name,
                          {
                            rules: [{ required: item.required, message: '请输入' + item.label + '!' }, ...(!item.validator ? [] : item.validator)],
                            initialValue: typeof item.value == 'function' ? item.value(item, index, this.formOption) : item.value,
                            validateTrigger: 'blur',
                            validateFirst: true
                          }
                        ]}
                        disabled={item.disabled}
                        readonly={item.readonly}
                        name={item.name}
                      // onChange={typeof item.onChange == 'function' ? item.onChange.bind(this, item) : ''}
                      />
                    )
                  }
                  if (item.type !== 'customer') {
                    return (
                      <a-col span={item.width ?? 8}>
                        <a-form-item
                          label={item.label}
                          required={item.required!}
                          // extra="x"
                          name={item.name}
                        >
                          {formItem}
                        </a-form-item>
                      </a-col>
                    )
                  } else {
                    return (
                      <a-col span={24}>
                        {item.render}
                      </a-col>
                    )
                  }
                })
              }
            </a-row>
            <div class="btns">
              <a-button type="" size="large" >重置</a-button>
              <a-button type="primary" loading={this.btnLoading} style="margin-left: 15px;" size="large" onClick={this.submit}>提交</a-button>
            </div>
          </a-form>
        </div>
        <router-view ref="content"></router-view>
      </div>
    )
  }

}