/**
 * 模块编译处理器
 * 解释模块的config.json
 */
import { RouteConfig } from 'vue-router'
import { manageRouter, templateView } from '../config/router.config';
import menuConfig from '../config/menu.config';

interface appConfig {
  appName: string,  // 模块文件夹的命名，自动获取，模块配置不需要填
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
    const app = require.context('@/app/', true, /config.json$/);
    app.keys().forEach((filePath) => {
      if(this.getCharCount(filePath, '/') === 2) {
        let config: appConfig = app(filePath);
        var appName = filePath.substring(filePath.indexOf('/') + 1, filePath.indexOf('/', filePath.indexOf('/') + 1));
        config.appName = appName;
        this.apps.push(config);
      }
    });
    this.getRouter();
    this.getMenu();
    this.parsing();
    console.log("路由", this.router);
    console.log("菜单", this.menus);
  }

  getCharCount(str: string, char: string) {
    var regex = new RegExp(char, 'g');
    var result = str.match(regex);
    var count = !result ? 0 : result.length;
    return count;
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
          if (Array.isArray(routerItem.children)) {
            routerItem.children?.push(router)
          } else {
            routerItem.children = [router];
          }
        }

      })
    })
    // 一级菜单会被重定向到第一个二级菜单
    router?.map((routerItem) => {
      if (Array.isArray(routerItem.children)) {
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
            if (pages[i].menu?.show) {
              subMenu.push({
                path: menuItem.path + '/' + appItem.id + '/' + pages[i].id,
                name: pages[i].menu?.name ?? pages[i].name,
                children: []
              })
            }
          }
          if (subMenu.length > 0) {
            let menuValue = {
              path: menuItem.path + '/' + appItem.id,
              name: appItem.name,
              children: subMenu
            };
            if (Array.isArray(menuItem.children)) {
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
      for (let i in appItem.pages) {
        let { data } = appItem.pages[i];
        if (typeof data !== 'object') {
          break;
        }
        var selfModule = {};   // 模块自身指令
        var publicModule = {};  // 公共指令实现
        try {
          selfModule = require('@/app/' + appItem.appName + '/' + appItem.pages[i].id );
        } catch (error) {
        }
        try {
          const app = require.context('@/utils/public/', true, /.ts$/);
          app.keys().forEach((filePath) => {
            let modules = app(filePath);
            Object.keys(modules).forEach(key => {
              if(publicModule.hasOwnProperty(key)) {
                console.error("公共指令中出现了重复的指令", "指令名：" + key, "路径：" + filePath);
              } else {
                Object.assign(publicModule, {
                  [key]: modules[key]
                })
              }
            });
          })
        } catch (error) {
          console.error("加载公共指令出现了未知问题", error);
        }
        this.parsingData(data, selfModule, publicModule);
        console.log(data);
      }
    })
  }

  /**
   * 解析指令
   * @param data 
   * @param path 目标页面的路径
   */
  public parsingData(data: any, selfModule: any, publicModule: any) {
    Object.keys(data).forEach((item: string) => {
      let value = data[item];
      if (typeof value == 'string' && value.indexOf('@') != -1) {
        var funName = ''; // 函数名
        var params: string[] = []; // 参数
        // 带参数
        if (value.indexOf("('") != -1) {
          funName = value.substring(1, value.indexOf('('));
          params = value.substring(value.indexOf("(") + 2, value.indexOf(")") - 1).split(',');
        } else {
          funName = value.substring(1, value.length );
        }
       
        var temp = false;
        // 先查询与页面标识同名的文件是否存在该函数
        Object.keys(selfModule).forEach((key: string) => {
          if(key === funName) {
            Object.assign(data, {
              [item]:  function (...p: any) {
                return selfModule[key].apply(this, [...params, ...p])
              }
            })
            temp = true;
          }
        })
        if(!temp) {
          Object.keys(publicModule).forEach((key: string) => {
            if(key === funName) {
              Object.assign(data, {
                [item]:  function (...p: any) {
                  return publicModule[key].apply(this, [...params, ...p])
                }
              })
              temp = true;
            }
          })
        }
        if(!temp) data[item] = () => {}
      }
      if (value instanceof Object) {
        // console.log(value)
        this.parsingData(value,  selfModule, publicModule);
      }
    })
  }
}

export default compiler;