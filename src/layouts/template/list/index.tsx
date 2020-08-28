import { Vue, Component, Ref } from 'vue-property-decorator'
import * as tsx from "vue-tsx-support";
import '@/assets/style/listView.less';
import { STable } from '@/components';
import { formItem } from '@/utils/interface'
import menuConfig from "@/config/menu.config";
import { RouteConfig } from "vue-router";

@Component({
  components: { stable: STable }
})
export default class extends tsx.Component<any> {

  @Ref() content: any;

  public searchForm = [];  // 搜索表单
  public columns = []; // 表格项
  public queryParam = {};  // 检索字段

  // 加载表格数据
  public loadData = async (parameter: Object) => {
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
      });
    });
    const { content } = this;
    if (content && content.api) {
      if (content.setParameter) {
        Object.assign(this.queryParam, await content.setParameter(this.queryParam));
      }
      return content.api(Object.assign(parameter, this.queryParam)).then((res: any)=> {
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

  mounted() {
    var { content } = this;
    Object.assign(this, {
      searchForm: content.searchForm ?? [],
      columns: content.columns ?? []
    })
  }

  protected render() {
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
            <a-button type="primary" icon="reload">
              刷新
            </a-button>
          </div>
        </div>
        {/* 搜索区域 */}
        <a-form layout="inline" class="searchView">
          {
            this.searchForm.map((item: formItem, index) => {
              return (
                <div class="single" >
                  <div class="label">{item.label}：</div>
                  <a-input placeholder="请输入" size="default" />
                </div>)
            })
          }
          <div class="search-btn">
            <a-button type="primary" click="searchSubmit">查询</a-button>
            <a-button style="margin-left: 15px" click="resetQueryForm">重置</a-button>
          </div>
        </a-form>
        {/* 表格区域 */}
        <stable
          ref="table"
          size="default"
          rowKey= {(record: any, index: number) => index}
          columns= {this.columns}
          data= {this.loadData}
          showPagination="auto"
          key="key"
          bordered={false}
          defaultExpandAllRows={true}
          expandRowByClick={true}
        // loadComplete="loadComplete"
        // expandedRowRender="pageMeta.expandedRowRender"
        >

          <span slot="action" slot-scope="text, record, xx">
            <template>
              <a class="actionBtn" >
                查看
                  </a>
              <a-divider type="vertical" />
              <a class="actionBtn editBtn" >编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除这条记录吗？" okText="确定" cancelText="取消" placement="right">
                <a class="actionBtn delBtn" >删除</a>
              </a-popconfirm>
            </template>
          </span>
        </stable>

        <router-view ref="content"></router-view>
      </div>
    )
  }
}


