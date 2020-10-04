import { Component, Prop, PropSync, Emit, Watch, Ref } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import './index.less';


interface formInterface {
  role: string
};

@Component({
})
export default class extends tsx.Component<Vue> {

  public get ruleForm() {
    return this.$form.createForm(this);
  } 

  @Prop({
    type: String,
    default: 'blue'
  }) public theme!: 'blue' | 'orange' | 'pink';  // 主题色，蓝、橙、粉红
  @PropSync('show', { type: Boolean, default: true }) public visible!: boolean;
  @Prop({
    type: String,
    default: '设置第一节点'
  }) public title!: string;
  @Prop({
    type: Array,
    default: () => []
  }) public formOptions!: Array<any>;

  public form: Array<any> = [];

  @Watch('formOptions', { immediate: true, deep: true })
  public onFormOptions(newValue: Array<any>, oldValue: Array<any>) {
   // console.log('监听到formOptions发生改变', newValue);
    this.form = newValue;
  }

  // 确认提交按钮
  public submit() {
    this.ruleForm.validateFields((err: any, values: any) => {
      if (!err) {
        this.$emit('submit', values)
      } else {
        console.log('表单内存在未填项');
      }
    });
  }
  

  protected render() {
    return <div >
      <a-modal v-model={this.visible} title={this.title} onOk="hideModal" footer={null} width="450px" class={['model', this.theme]}>
        <div class={this.theme}>
          <a-form form={this.ruleForm} >
            {
              this.form.map((item, index) => {
                let formItem;
                if (item.type === 'select') {
                  formItem = (
                    <a-select
                      placeholder="请选择"
                      style="width: 100%"
                      mode={item.mode}
                      name={item.name}
                      loading={item.loading}
                      v-decorator={[item.name, { rules: [{ required: true, message: '请选择' + item.label + '!' }], initialValue: item.value }]}
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
                  )
                } else if (item.type == 'radio') {
                  formItem = (
                    <a-radio-group
                      name={item.name}
                      v-decorator={[item.name, { rules: [{ required: true, message: '请选择' + item.label + '!' }], initialValue: item.value }]}>
                      {
                        item.selectOptions.map((symbol: { value: any; label: any; }) => (
                          <a-radio value={symbol.value}>
                            {symbol.label}
                          </a-radio>
                        ))
                      }
                    </a-radio-group>
                  )
                } else if (item.type == 'checkbox') {
                  formItem = (
                    <a-checkbox-group
                      v-decorator={[item.name, { rules: [{ required: false, message: '请选择' + item.label + '!' }], initialValue: item.value }]}
                      name={item.name}>
                      {
                        item.selectOptions.map((symbol: { label: any; value: any }) => (
                          <a-checkbox value={symbol.value}>
                            {symbol.label}
                          </a-checkbox>
                        ))
                      }
                    </a-checkbox-group>
                  )
                }
                return (
                  <a-form-item name={item.name} class={this.theme} >
                    <div class="formItem">
                      <div class="label">
                        <span>{item.label}</span>
                        <div class="point"></div>
                      </div>
                      {formItem}
                      <div class="notice">{item.notice}</div>
                    </div>
                  </a-form-item>
                )
              })
            }
            <a-button type="primary" class={['confirm-btn', this.theme]} onClick={this.submit}>
              确 认
            </a-button>
          </a-form>
        </div>
      </a-modal>
    </div>
  }
}