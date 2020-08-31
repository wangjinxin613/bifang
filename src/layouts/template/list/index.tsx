import { Vue, Component, Ref } from 'vue-property-decorator'
import * as tsx from "vue-tsx-support";
import '@/assets/style/listView.less';
import { STable } from '@/components';
import { formItem } from '@/utils/interface'
import menuConfig from "@/config/menu.config";
import { RouteConfig } from "vue-router";
import { FormItem } from 'ant-design-vue/types/form/form-item';

@Component({
  components: { stable: STable }
})
export default class extends tsx.Component<any> {

  @Ref() content: any;
  @Ref() table: any;

  public searchForm = [];  // 搜索表单
  public columns: Array<any> = []; // 表格项
  public queryParam = {};  // 检索字段

  // 三级菜单列表
  get menus() {
    const basicRoute = this.$route.matched[1];
    const secondRoute = this.$route.matched[2];
    let menus: Array<RouteConfig> = [];
    var secondMenus: Array<RouteConfig> = [];
    for (const i in menuConfig) {
      if (menuConfig[i].path === basicRoute.path) {
        secondMenus = menuConfig[i].children ?? [];
      }
    }
    for (let i in secondMenus) {
      if (secondMenus[i].path == secondRoute.path) {
        menus = secondMenus[i].children ?? [];
      }
    }
    return menus;
  }

  // 三级菜单被选中的index
  get active(): Array<number> {
    const { menus } = this;
    for (const i in menus) {
      if (menus[i].path === this.$route.path) {
        return [Number(i)];
      }
    }
    return [];
  }

  // 刷新
  private reload() {
    var parent: any = this.$parent;
    parent.refresh();
  }

  // 搜索提交按钮点击事件
  private searchSubmit() {
    var queryParam: any = {}; //查询参数
    for (let i in this.searchForm) {
      let item: any = this.searchForm[Number(i)];
      if (item.type == 'dateRange' && item.value && item.name) {
        // if (item.value[0] instanceof moment && item.value[1] instanceof moment) {
        //   queryParam[item.name[0]] = new Date(item.value[0].format('YYYY-MM-DD 00:00:00')).getTime() / 1000;
        //   queryParam[item.name[1]] = new Date(item.value[1].format('YYYY-MM-DD 23:59:59')).getTime() / 1000;
        // }
      } else {
        if (item.value && item.name) {
          queryParam[item.name] = item.value;
        }
      }
    }
    this.queryParam = queryParam;
    this.table.refresh();
  }

  // 重置搜索表单
  private resetQueryForm() {
    const { content } = this;
    if (content && content.searchForm) {
      for (let i in content.searchForm) {
        let item = content.searchForm[i];
        if (item.type == 'dateRange') {
          item.value = [];
        } else {
          item.value = '';
        }
      }
    }
    this.searchSubmit();
  }

  seeClick(record: any) {
    this.columns[this.columns.length - 1].see(record);
  // console.log(record);
  }

  mounted() {
    var { content } = this;
    // 操作的宽度固定 140
    if (content.columns?.length > 0 && content.columns[content.columns.length - 1].title === '操作') {
      content.columns[content.columns.length - 1].width = 140;
    }
    Object.assign(this, {
      searchForm: content.searchForm ?? [],
      columns: content.columns ?? []
    })
  }

  protected render() {
    const loadData = async (parameter: Object) => {
      const emptyTableData = {
        data: [],
        pageSize: 10,
        pageNo: 0,
        totalPage: 0,
        totalCount: 0
      };
      await new Promise((resolve, reject) => {
        this.$nextTick(() => {
          resolve();
        })
      });
      const { content } = this;
      if (content && content.api) {
        if (content.setParameter) {
          Object.assign(this.queryParam, await content.setParameter(this.queryParam));
        }
        return content.api(Object.assign(parameter, this.queryParam)).then((res: any) => {
          if (res.code == 500) {
            return Object.create(emptyTableData);
          }
          return {
            data: res.list,
            pageSize: res.pageSize,
            pageNo: res.curPage,
            totalPage: Math.ceil(res.totalCount / res.pageSize),
            totalCount: res.totalCount
          };
        });
      } else {
        return Object.create(emptyTableData);
      }
    }

    return (
      <div class="listView">
        <div class="top-view">
          <a-menu mode="horizontal" v-model={this.active} multiple={false} selectable={false}>
            {
              this.menus.map((item, index) => {
                return <a-menu-item key={index}>{item.name}</a-menu-item>
              })
            }
          </a-menu>
          <div class="right-view">
            <a-button type="primary" class="createBtn" icon="file-add">
              新建
            </a-button>
            <a-button type="primary" icon="export">
              导出
            </a-button>
            <a-button type="primary" icon="reload" onClick={this.reload}>
              刷新
            </a-button>
          </div>
        </div>
        {/* 搜索区域 */}
        <a-form layout="inline" class="searchView">
          {
            this.searchForm.map((item: formItem, index) => {
              let searchFrom;
              if (item.type === 'input') {
                searchFrom = <a-input placeholder="请输入" size="default" />
              } else if (item.type == 'select') {
                searchFrom = (
                  <a-select v-model={item.value} placeholder="请选择" default-value="0">
                    {
                      item.selectOptions?.map((symbol: any) => (
                        <a-select-option value={symbol.value}>{symbol.label}</a-select-option>
                      ))
                    }
                  </a-select>
                )
              }
              return (
                <div class="single" >
                  <div class="label">{item.label}：</div>
                  {searchFrom}
                </div>)
            })
          }
          <div class="search-btn">
            <a-button type="primary" onClick={this.searchSubmit}>查询</a-button>
            <a-button style="margin-left: 15px" onClick={this.resetQueryForm}>重置</a-button>
          </div>
        </a-form>
        {/* 表格区域 */}
        <stable
          ref="table"
          size="default"
          rowKey={(record: any, index: number) => index}
          columns={this.columns}
          data={loadData}
          showPagination="auto"
          key="key"
          bordered={false}
          defaultExpandAllRows={true}
          expandRowByClick={true}
          // loadComplete="loadComplete"
          // expandedRowRender="pageMeta.expandedRowRender"
          scopedSlots={{
            action: (props: any, record: any) => {
              return <span class="action">
                <a-icon type="unordered-list" class="see" onClick={this.columns[this.columns.length - 1].see.bind(this, record) } />
                <a-divider type="vertical" />
                <a-popconfirm title="确定删除这条记录吗？" okText="确定" cancelText="取消" placement="right">
                  <a-icon type="delete" class="delete" />
                </a-popconfirm>
              </span>
            }
          }}
        >
        </stable>
        <router-view ref="content"></router-view>
      </div>
    )
  }
}


