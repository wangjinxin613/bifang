/**
 * 模块编译处理器
 * 解释模块的config.json
 */
import { RouteConfig } from 'vue-router'
import { manageRouter, templateView } from '../config/router.config';
import menuConfig from '../config/menu.config';

interface appConfig {
  name: string,
  id: string,
  parentName: string,
  parentId: string,
  pages: Array<{
    id: string,
    name: string,
    type: string,
    menu?: {
      show: boolean,
      name: string
    },
    data?: Object
  }>
}

class compiler {

  public apps: Array<appConfig> = [];   // 所有的模块
  public router: Array<RouteConfig> = [];   // 路由
  public menus: Array<any> = [];  // 菜单

  constructor() {
    // 初始化模块
    const app = require.context('@/app/', true, /config.json$/);
    app.keys().forEach((filePath) => {
      let config: appConfig = app(filePath);
      this.apps.push(config);
    });
    this.getRouter();
    this.getMenu();
    this.parsing();
    console.log("路由", this.router);
    console.log("菜单",this.menus);
  }

  // 获取路由
  public getRouter() {
    var router: Array<RouteConfig> = manageRouter[0].children ?? [];
    this.apps.map((appItem) => {
      let { pages } = appItem;
      router?.map((routerItem) => {
        if (appItem.parentName === routerItem.name) {
          var subRouter = []
          for (let i in pages) {
            subRouter.push({
              path: routerItem.path + '/' + appItem.id + '/' + pages[i].id,
              name: pages[i].name,
              meta: { template: pages[i].type ?? 'default' },
              component: {
                template: '<div>455</div>',
                data: () => {
                  return pages[i].data;
                }
              }
            })
          }
          let router = {
            path: routerItem.path + '/' + appItem.id,
            redirect: routerItem.path + '/' + appItem.id + '/' + pages[0].id,
            name: routerItem.name,
            components: templateView,
            children: subRouter
          }
          if(Array.isArray(routerItem.children)) {
            routerItem.children?.push(router)
          } else {
            routerItem.children = [router];
          }
        }
        
      })
    })
    // 一级菜单会被重定向到第一个二级菜单
    router?.map((routerItem) => {
      if(Array.isArray(routerItem.children) ) {
        Object.assign(routerItem, {
          redirect: routerItem.children[0].path
        })
      }
    })
    this.router = manageRouter;
  }

  // 获取菜单
  public getMenu() {
    this.apps.map((appItem) => {
      let { pages } = appItem;
      menuConfig?.map((menuItem) => {
        if (menuItem.name === appItem.parentName) {
          let subMenu = [];
          for (let i in pages) {
            if(pages[i].menu?.show) {
              subMenu.push({
                path: menuItem.path + '/' + appItem.id + '/' + pages[i].id,
                name: pages[i].menu?.name ?? pages[i].name,
                children: []
              })
            }
          }
          if(subMenu.length > 0) {
            let menuValue = {
              path: menuItem.path + '/' + appItem.id,
              name: appItem.name,
              children: subMenu
            };
            if(Array.isArray(menuItem.children)) {
              menuItem.children.push(menuValue)
            } else {
              menuItem.children = [menuValue];
            }
          }
        }
      })
    })
    this.menus = menuConfig;
  }

  /**
   * 解析data中的指令，由于config.json中的data不能出现函数，于是设计了一些指令，解析指令找到对应的函数后执行函数
   * 指令关键字为'@'，凡是带'@'关键字的字符串都是指令
   * 指令的意思是执行一个外部函数
   * 首先会在与页面（pages）同名（name）的文件中找，如果没有则向公共指令中寻找
   */
  public parsing() {
    this.apps.map(appItem => {
      for(let i in appItem.pages) {
        let { data } = appItem.pages[i];
        if(typeof data !== 'object') {
          break;
        }
        console.log();
        this.parsingData(data, appItem.pages[i].id);
      }
    })
  }

  /**
   * 解析指令
   * @param data 
   * @param id 页面的标识
   */
  public parsingData(data: any, id: string) {
    Object.keys(data).forEach((key: string) => {
      let value = data[key];
      if(typeof value == 'string' && value.indexOf('@') != -1) { 
        var funName = ''; // 函数名
        var params = []; // 参数
        // 带参数
        if(value.indexOf("('") != -1) {
          funName = value.substring(1, value.indexOf('('));
          params = value.substring(value.indexOf("(") + 2, value.indexOf(")")).split(',');
          console.log(params);
          console.log(value);
        }
      }
      if(value instanceof Object) {
        // console.log(value)
        this.parsingData(value, id);
      }
    })
  }
}

export default compiler;