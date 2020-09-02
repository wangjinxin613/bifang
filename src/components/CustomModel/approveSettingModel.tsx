import { Component, Prop, PropSync, Emit, Watch } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";
import './index.less';


interface formInterface {
  role: string
};

@Component({
})
export default class extends tsx.Component<Vue> {
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
    //console.log('监听到formOptions发生改变', newValue);
    this.form = newValue;
  }


  // 确认提交按钮
  @Emit()
  public submit() {
    this.formOptions = this.form;
    let result = {};
    this.form.filter((current) => {
      Object.assign(result, {
        [current.name]: current.value
      })
    })
    return result;
  }

  protected render() {
    return <div >
      <a-modal v-model={this.visible} title={this.title} onOk="hideModal" footer={null} width="420px" class={['model', this.theme]}>
        <div class={this.theme}>
          <a-form-model ref="ruleForm">
            {
              this.form.map((item, index) => {
                let formItem;
                if (item.type === 'select') {
                  formItem = (
                    <a-select
                      placeholder="请选择"
                      v-model={item.value}
                      style="width: 100%"
                      mode={item.mode}
                      name={item.name}
                    >
                      {
                        item.selectOptions?.map((symbol: any) => (
                          <a-select-option value={symbol.value}>{symbol.label}</a-select-option>
                        ))
                      }
                    </a-select>
                  )
                } else if (item.type == 'radio') {
                  formItem = (
                    <a-radio-group name={item.name} v-model={item.value}>
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
                    <a-checkbox-group v-model={item.value} name={item.name}>
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
                  <a-form-model-item prop={item.name} class={this.theme}>
                    <div class="formItem">
                      <div class="label">
                        <span>{item.label}</span>
                        <div class="point"></div>
                      </div>
                      {formItem}
                      <div class="notice">{item.notice}</div>
                    </div>
                  </a-form-model-item>
                )
              })
            }
            <a-button type="primary" class={['confirm-btn', this.theme]} onClick={ this.submit }>
              确 认
            </a-button>
          </a-form-model>
        </div>
      </a-modal>
    </div>
  }
}