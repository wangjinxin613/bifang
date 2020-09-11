import { Vue, Component, Ref } from 'vue-property-decorator'
import * as tsx from "vue-tsx-support";
import '@/assets/style/formView.less';
import { formItem, formModel } from '@/utils/interface'
import { deepCopy } from '@/utils/util';
import { formPageTypeEnum as pageTypeEnum } from '@/utils/enum';

@Component({
})
export default class extends tsx.Component<Vue> {

  @Ref() content!: formModel;

  public btnLoading: Boolean = false;  // 提交按钮刷新状态
  public pageLoading: Boolean = false;  // 页面刷新状态
  public formOption: Array<formItem> = [];   // 表单配置项(也不一定是表单)
  public apiData!: Object; // detailApi调用成功的原始数据
  public deleteBtnLoading : Boolean = false;

  public get id() {
    return this.$route.params.id;
  }

  // 页面标题
  public get pageTitle() {
    const pageTypeText = this.pageType === pageTypeEnum.create ? '新建' : this.pageType === pageTypeEnum.update ? '编辑' : '查看';
    return pageTypeText + this.$route.name;
  }

  // 页面表单类型
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

  public get formModel() {
    return this.$form.createForm(this)
  }

  // 详情页的字段值
  public getTextItem(item: any) {
    if (item.type === 'select' && Array.isArray(item.selectOptions)) {
      for (let i in item.selectOptions) {
        if (item.selectOptions[i].value == item.value) {
          return item.selectOptions[i].label;
        }
      }
    }
    return item.value;
  }

  public get formData() {
    return this.formModel.getFieldsValue();
  }

  public set formData(value) {
    console.log('监听到赋值操作', value);
    this.setFieldsValue(value);
    try {
      this.formModel.setFieldsValue(value);
    } catch (error) {
      
    }
  }

  // 提交表单事件
  public submit() {
    this.formModel.validateFields(async err => {
      if (!err) {
        var fieldsValue = this.formModel.getFieldsValue();
        const { content } = this;

        const hide = this.$message.loading('正在提交中，请稍后', 0);
        this.btnLoading = true;

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

        // 如果存在id则指定把id加上
        if (!isNaN(Number(this.id))) {
          fieldsValue.id = this.id;
        }

        // 提交前处理
        if (content.submitBefore && typeof content.submitBefore) {
          fieldsValue = await content.submitBefore(fieldsValue);
          if (!fieldsValue) {
            hide();
            this.btnLoading = false;
            return;
          }
        }

        // 开始提交调接口
        const deployApi = this.pageType === pageTypeEnum.create ? content.createApi : content.updateApi;
        if (typeof deployApi === 'function') {
          deployApi(fieldsValue).then((res: any) => {
            if (typeof content.submitCallback == 'function') {
              content.submitCallback.call(content, res, fieldsValue);
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
      } else {
        console.log(this.$notification);
        this.$notification['error']({
          message: '表单校验试验',
          description:
            '存在未校验通过的表单项，请修改后重试！',
        });
      }
    })
  }

  // 删除表单事件
  public deleteThis() {
    const { content } = this; 
    this.$confirm({
      title: '确定要删除这个表单吗？',
      content: '删除后无法撤销',
      okText: '确定',
      okType: 'danger',
      cancelText: '不了',
      onOk:() => {
        if(typeof content.deleteApi == 'function') {
          const hide = this.$message.loading('正在删除中，请稍后...', 0);
          this.deleteBtnLoading = true;
          content.deleteApi({
            id: this.id
          }).then((res: any) => {
            if(typeof content.deleteCallback == 'function') {
              content.deleteCallback(res);
            } else {
              this.$success({
                title: '删除成功',
                okText: '知道了',
                onOk: () => {
                  this.$router.push({
                    path: '../list'
                  });
                }
              });
            }
            this.deleteBtnLoading = false;
            hide();
          })
        } else {
          this.$message.error("发生了未知错误");
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 向表单中赋值
  private setFieldsValue(res: any) {
    var formOption = this.formOption;
    if (typeof res != 'object') return;
    formOption.forEach((current: any, index) => {
      if (current.type == 'date' && res[current.name]) {
        if (typeof res[current.name] == 'number' && res[current.name] < 9999999999) {
          res[current.name] = res[current.name] * 1000;
        }
        //current.value = moment(res[current.name]);
      } else if (current.type == 'dateRange' && res[current.name[0]] && res[current.name[1]]) {
        //current.value = [moment(timeStamp(res[current.name[0]])), moment(timeStamp(res[current.name[1]]))];
      } else if (current.type == 'file' && current.name && current.name.name && current.name.hash && res[current.name.name]) {
        // let value = [];
        // let name = res[current.name.name].split(',');
        // let hash = res[current.name.hash].split(',');
        // name.forEach((current, index) => {
        //    value.push({
        //       hash: hash[index],
        //       name: current
        //    });
        // });
        // current.value = value;
      } else if (current.name && typeof res[current.name] != 'undefined' && res[current.name] != null && res[current.name] != '') {
        current.value = res[current.name];
      }
    });
  }

  // 重置表单
  public resetForm() {
    this.formModel.resetFields();
    // 重置文件类型
    this.formOption.forEach((current, index) => {
       if (current.type == 'file' && current.value && current.value.length != 0) {
          current.value = [];
       }
    });
    if(typeof this.content.resetForm == 'function') {
      this.content.resetForm();
    }
  }


  mounted() {
    const { content } = this;
    Object.assign(this, {
      formOption: content.formOption ?? [],
    })

    // 详情页和编辑页打开界面自动加载数据
    if (this.pageType === pageTypeEnum.detail || this.pageType == pageTypeEnum.update) {
      if (typeof content.detailApi == 'function') {
        content.detailApi({
          id: this.id
        }).then(async (res: any) => {
          this.apiData = deepCopy(res);
          if (typeof content.getCallback == 'function') {
            await content.getCallback.call(content, res);
          }
          this.setFieldsValue(res);
          this.pageLoading = false;
          this.$nextTick(() => {
            if (typeof content.loadDataAfter == 'function') {
              content.loadDataAfter.call(content, res);
            }
          })
        })
      }
    }
  }

  created() {
    if (this.pageType === pageTypeEnum.detail || this.pageType == pageTypeEnum.update) {
      this.pageLoading = true;
    }
  }

  protected render() {
    return (
      <div>
        <div class="formView">
          <div class="header">
            <div class="title"><a-icon type="file-add" class="icon" />{this.pageTitle}</div>
            <div class="reback" onClick={() => this.$router.go(-1)}>返回</div>
          </div>
          <div class="form">
            <a-skeleton loading={this.pageLoading} active>
              {
                !this.pageLoading &&
                <a-form layout="horizontal" form={this.formModel} >
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
                            disabled={ Array.isArray(item.disabled) && item.disabled.indexOf(this.pageType) != -1 ? true : false}
                            name={item.name}
                            type={item.name}
                          // prefix="item.isMoney ? (typeof item.prefix == 'undefined' ? '￥' : item.prefix) : item.prefix"
                          // suffix="item.suffix"
                          // min="item.isMoney ? 0 : item.min"
                          ></a-input>
                        } else if (item.type == 'select') {
                          formItem = <a-select
                            placeholder="请选择"
                            disabled={ Array.isArray(item.disabled) && item.disabled.indexOf(this.pageType) != -1 ? true : false}
                            v-decorator={[item.name, { rules: [{ required: item.required, message: '请选择' + item.label + '!' }], initialValue: item.value }]}
                            mode={item.mode}
                            loading={ typeof item.selectOptions === 'function' ? true : false }
                            onChange={ (value: any, option: any) => { typeof item.onChange == 'function' && item.onChange.call(this, value, { key: index, item: item, formOption: this.formOption, event: event, label: (event?.target as any).textContent }) }}
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
                                      if (typeof item.selectOptionsCallback === 'function' && this.pageType != pageTypeEnum.create) {
                                        res = item.selectOptionsCallback(res, this.apiData);
                                      }
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
                              disabled={ Array.isArray(item.disabled) && item.disabled.indexOf(this.pageType) != -1 ? true : false}
                              name={item.name}
                            // onChange={typeof item.onChange == 'function' ? item.onChange.bind(this, item) : ''}
                            />
                          )
                        }
                        if(Array.isArray(item.hide) && item.hide.indexOf(this.pageType) != -1) {
                          return '';
                        }
                        const textItem = <div class="textItem">{ typeof item.selectOptions == 'function' ? <a-icon type="loading" />: this.getTextItem(item)}</div>
                        if (item.type !== 'customer') {
                          return (
                            <a-col span={item.width ?? 8}>
                              <a-form-item
                                label={item.label}
                                required={item.required!}
                                // extra="x"
                                name={item.name}
                              >
                                {this.pageType === pageTypeEnum.detail ? <div><div style="display:none">{formItem}</div>{textItem}</div> : formItem}
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
                  {
                    this.pageType === pageTypeEnum.detail ? (
                      <div class="btns">
                        <a-button type="danger" size="large" loading={ this.deleteBtnLoading } onClick={ this.deleteThis }>删除</a-button>
                        <router-link to={'../form/' + this.id}><a-button type="primary" style="margin-left: 20px;" size="large" >编辑</a-button></router-link>
                      </div>
                    ) : (
                        <div class="btns">
                          <a-button type="" size="large" onClick={this.resetForm} >重置</a-button>
                          <a-button type="primary" loading={this.btnLoading} style="margin-left: 20px;" size="large" onClick={this.submit}>提交</a-button>
                        </div>
                      )
                  }
                </a-form>
              }
            </a-skeleton>
          </div>
        </div>
        <router-view ref="content"></router-view>
      </div>
    )
  }

}