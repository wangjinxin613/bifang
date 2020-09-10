/**
 * 模块编译处理器
 * 解释模块的config.json
 */
import { RouteConfig } from 'vue-router'
import { manageRouter, templateView } from '../config/router.config';
import menuConfig from '../config/menu.config';
import app from '@/store/modules/app';

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
        if(Array.isArray(routerItem.children) ) {
          Object.assign(routerItem, {
            redirect: routerItem.children[0].path
          })
        }
      })
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
        this.parsingData(data);
      }
    })
  }

  public parsingData(data: any) {
    Object.keys(data).forEach((key: string) => {
      let value = data[key];
      if(typeof value == 'string' && value.indexOf('@') != -1) { 
        var reg = /(\w)+/ig;
        //console.log(reg.exec(value));
        var result = value.match(reg); // 捕获的第一个结果为函数名，后边的是参数
        console.log(value.match(reg));
      }
      if(value instanceof Object) {
        // console.log(value)
        this.parsingData(value);
      }
    })
  }
}

export default compiler;