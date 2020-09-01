import { Vue, Component, Ref } from 'vue-property-decorator'
import * as tsx from "vue-tsx-support";
import '@/assets/style/formView.less';
import { formItem } from '@/utils/interface'

@Component({
})
export default class extends tsx.Component<any> {

  @Ref() content: any;

  public formOption: Array<formItem> = [];   // 表单配置项(也不一定是表单)

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
          <a-form class="form" layout="horizontal" >
            <a-row gutter={60} align="top" type="flex" style="width: 100%;">
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
                          // rules: [{ required: item.required, message: '请输入' + item.label + '!' }, ...(!item.validator ? [] : item.validator)],
                          // initialValue: typeof item.value == 'function' ? item.value(form, item, index, formOption) : item.value,
                          // validateTrigger: 'blur',
                          // validateFirst: true
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
                        item.selectOptions?.map((symbol: any) => (
                          <a-select-option value={symbol.value}>{symbol.label}</a-select-option>
                        ))
                      }
                    </a-select>
                  }
                  if(item.type !== 'customer') {
                    return (
                      <a-col span={item.width ?? 8}>
                        <a-form-item
                          label={item.label}
                          label-col={{ span: 7, pull: 1 }}
                          required={item.required!}
                          // extra="x"
                          wrapper-col={{ span: 16 }}
                          name={item.name}
                        >
                          {formItem}
                        </a-form-item>
                      </a-col>
                    )
                  } else {
                    return (
                      <a-col span={24}>
                        { item.render }
                      </a-col>
                    )
                  }
                })
              }
            </a-row>
          </a-form>
        </div>
        <router-view ref="content"></router-view>
      </div>
    )
  }

}