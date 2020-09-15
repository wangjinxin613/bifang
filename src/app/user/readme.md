# 模块开发文档

> 模块存在与 /src/app目录内，目录内的每一个文件夹都可以视为一个模块，前提是模块文件夹内存在一个config.json文件。 config.json是模块的配置文件，项目运行后会自动加载所有模块的配置文件，然后解析出具体的不同的模块以及页面。

### 模块具有以下特点

- 一个模块由若干个页面组成，通常一个页面对应一个路由。

- 模块和模块之间是完全解耦的，删除一个模块不会影响到其他的模块
- 模块将业务抽离出来，模块开发只需要关心具体的业务即可

### 模块的配置文件

```js
{
  "name": "审批管理",   // 模块名
  "id": "approveTest",  // 模块标识，会在路由的地址中体现
  "parentName": "系统",  // 父模块名称
  "parentId": "system", // 父模块标识
  "pages": [    // 页面
    {
      "id": "list",  // 页面标识，会在路由的地址中体现
      "name": "审批管理列表",  // 页面名
      "type": "list",   // 页面类型
      "menu": { // 是否是菜单，非必填
        "show": true,  // 是菜单的页面
        "name": "全部"  // 菜单命名
      },
      "data": {   // 数据
        "api": "@get('/activity/getApproveList')",
        "deleteApi": "@get('/activity/delete')",
        "searchForm": [
          {
            "type": "select",
            "selectOptions": "@approveIdSelect",
            "label": "审批表单名称",
            "name": "approveId"
          }
        ],
        "columns": [
          {
            "title": "审批表单名称",
            "dataIndex": "approveName",
            "width": 150
          },
          {
            "title": "审批流类型",
            "dataIndex": "ifDelete",
            "width": 150,
            "customRender": "@ifDeleteRender"
          },
          {
            "title": "审批流",
            "dataIndex": "roleListFlow",
            "customRender": "@roleListFlowRender"
          },
          {
            "title": "操作",
            "scopedSlots": { "customRender": "action" },
            "see": "@see",
            "del": true
          }
        ]
      }
    },
    {
      "id": "form",
      "name": "（创建表单审批流）",
      "type": "form",
      "menu": {
        "show": true,
        "name": "（创建表单审批流）"
      },
      "data": {
        
      }
    }
  ]
}
```

模块解析器会自动将配置文件中的pages的信息解析成不同的页面，一个page对应一个页面

- page的路由地址是  /(父模块标识)/(模块标识)/(页面标识) ，如：`/system/approveTest/list`

- page的类型有 `list、form、default` ，分别对应列表页、表单页和默认页的页面模板。表单页包含详情页
- page的data是指页面中的数据，实际会渲染到组件的数据中，页面模板会渲染最终获得这个数据并渲染出内容，不同的页面类型的data中的接口也是不一样的，具体可以参见不同模板对应的接口
- form类型的页面会将路由的path加上`/:id`

在模块文件夹内可以