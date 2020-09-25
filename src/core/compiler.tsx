/**
 * 模块编译处理器
 * 解释模块的config.json
 */
import { RouteConfig } from 'vue-router'
import { manageRouter, templateView } from '../config/router.config';
import menuConfig from '../config/menu.config';
import { Vue, Component, Ref } from 'vue-property-decorator'
import * as tsx from "vue-tsx-support";
import { deepCopy } from '@/utils/util';
import app from '@/store/modules/app';

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
    data?: any,
    copy?: {
      id: string  // 复制模块的id
    },
    // originData?: any, // 自动解析模块中的data，模块配置不需要填
    // methods?: any,  // 自动解析模块中的methods, 模块配置不需要填
    self?: any, // 组件实例 配置不需要填
    // render?: any, // 组件的渲染函数 配置中不需要填
    selfModule?: any, // 自定义模块
  }>, 
}

class compiler {

  public apps: Array<appConfig> = [];   // 所有的模块
  public router: Array<RouteConfig> = [];   // 路由
  public menus: Array<any> = [];  // 菜单
  public originApps: Array<appConfig> = []; // 原始的模块配置，未做任何处理的

  constructor() {
    try {
      const app = require.context('@/app/', true, /config.json$/);
      app.keys().forEach((filePath) => {
        if (this.getCharCount(filePath, '/') === 2) {
          let config: appConfig = app(filePath);
          var appName = filePath.substring(filePath.indexOf('/') + 1, filePath.indexOf('/', filePath.indexOf('/') + 1));
          config.appName = appName;
          this.apps.push(deepCopy(config));
          this.originApps.push(deepCopy(config));
        }
      });

      this.dealCopy();
      this.parsing();
      this.getRouter();
      this.getMenu(); 
    } catch (error) {

    }
    // console.log("路由", this.router);
    // console.log("菜单", this.menus);
  }

  // 处理复制模块的情况
  dealCopy() {
    this.apps.map((appItem: any, key) => {
      let { pages } = appItem;
      for (let i = 0; i <= pages.length - 1; i++) {
        if (typeof pages[i].extend == 'undefined' && typeof pages[i].extend?.id == 'undefined') {
          continue;
        }
        let currentPage = pages[i];
        let parentPage = this.findParentPage(currentPage, key);
        if (currentPage.extend?.id === parentPage.id) {
          Object.keys(parentPage).forEach(k => {
            if (typeof currentPage[k] == 'undefined' && k != 'self') {
              Object.assign(currentPage, {
                [k]: parentPage[k]
              })
            }
          })
        }
      }
    })
  }

  // 找到父级页面
  findParentPage(currentPage: any, key: number) {
    for (let j = 0; j <= this.originApps[key].pages.length - 1; j++) {
      let parentPage: any = this.originApps[key].pages[j];
      if (currentPage.extend?.id === parentPage.id) {
        return parentPage;
      }
    }
    return {};
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
            let page = pages[i];
            // 生成组件
            @Component({})
            class pageVue extends tsx.Component<any> {
              beforeCreate() {
                // 获取当前页面的组件实例
                pages[i].self = this;
                // 配置文件拼接的data传入到组件内部
                Object.assign(this, deepCopy( pages[i].data))
                // 原始data传入到组件内部并将this指向为组件实例
                if (typeof pages[i].selfModule.data === 'function') {
                  let originData = pages[i].selfModule.data.call(this);
                  originData.__proto__ = this;
                  Object.assign(this, originData)
                } else if (typeof pages[i].selfModule.data === 'object') {
                  let originData = pages[i].selfModule.data;
                  originData.__proto__ = this;
                  Object.assign(this, originData)
                }
                // methods传入到组件内部，并将this指向为组件实例
                if (typeof pages[i].selfModule.methods != 'undefined') {
                  Object.assign(this, pages[i].selfModule.methods)
                }
                if(typeof page.selfModule.beforeCreate === 'function' ) {
                  page.selfModule.beforeCreate();
                }
                console.log(page.selfModule);
              }
              created() {
                if(typeof page.selfModule.created === 'function' ) {
                  page.selfModule.created();
                }
              }
              mounted() {
                if(typeof page.selfModule.mounted === 'function' ) {
                  page.selfModule.mounted();
                }
              }
              render(h: any) {
                return typeof pages[i].selfModule.render == 'undefined' ? '' : pages[i].selfModule.render.call(this, h);
              }
            }
            subRouter.push({
              path: (routerItem.path + '/' + appItem.id + '/' + pages[i].id) + (pages[i].type == 'form' ? '/:id' : ''),
              name: pages[i].name,
              meta: { template: pages[i].type ?? 'default' },
              component: pageVue
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
        let page: any = appItem.pages[i];
        let { data } = page;
        if (typeof data !== 'object') {
          continue;
        }
        var selfModule: any = {};   // 页面自身模块
        var parentModule: any = {};   // 父级模块
        var publicModule = {};  // 公共模块

        appItem.pages[i].selfModule = {};
        // 父级页面
        if (typeof page.extend != 'undefined' && typeof page.extend?.id != 'undefined') {
          try {
            parentModule = require('@/app/' + appItem.appName + '/' + page.extend.id);
            if (typeof parentModule.default != 'undefined') {
              Object.assign(parentModule, parentModule.default)
            }
            Object.assign(appItem.pages[i].selfModule, 
              parentModule
            )
          } catch (error) {
          }
        }

        // 页面本身
        try {
          selfModule = require('@/app/' + appItem.appName + '/' + appItem.pages[i].id);
          if (typeof selfModule.default != 'undefined') {
            Object.assign(selfModule, selfModule.default)
          }
          Object.assign(appItem.pages[i].selfModule, 
            selfModule
          )
        } catch (error) {
          
        }
        
        // 公共
        try {
          const app = require.context('@/utils/public/', true, /.ts$/);
          app.keys().forEach((filePath) => {
            let modules = app(filePath);
            Object.keys(modules).forEach(key => {
              if (publicModule.hasOwnProperty(key)) {
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
        this.parsingData(data, selfModule, parentModule, publicModule, appItem.pages[i]);
      }
    })
  }

  /**
   * 解析指令
   * @param data 
   * @param path 目标页面的路径
   */
  public parsingData(data: any, selfModule: any, parentModule: any, publicModule: any, page: any) {
    Object.keys(data).forEach((item: string) => {
      let value = data[item];
      if (typeof value == 'string' && value.indexOf('@') != -1) {
        var funName = ''; // 函数名
        var params: string[] = []; // 参数
        // 解析函数名和参数数组
        if (value.indexOf("('") != -1) {
          funName = value.substring(1, value.indexOf('('));
          params = value.substring(value.indexOf("(") + 1, value.indexOf(")")).split(",");
          for (let i in params) {
            params[i] = params[i].replace(/\'?\s*/g, "");
          }
        } else {
          funName = value.substring(1, value.length);
        }

        funName = funName.replace(/\'?\s*/g, "");

        var temp = false;

        // 查询继承的父级页面是否存在该函数
        if (!temp && typeof page.extend != 'undefined' && typeof page.extend?.id != 'undefined') {
          Object.keys(parentModule).forEach((key: string) => {
            if (key === funName) {
              Object.assign(data, {
                [item]: function (...p: any) {
                  return parentModule[key].apply(page.self, [...params, ...p])
                }
              })
              temp = true;
            }
          })
        }

        // 查询与页面标识同名的文件是否存在该函数
        Object.keys(selfModule).forEach((key: string) => {
          if (key === funName) {
            Object.assign(data, {
              [item]: function (...p: any) {
                return selfModule[key].apply(page.self, [...params, ...p])
              }
            })
            temp = true;
          }
        })
        
        // 查询是否存在公共函数
        if (!temp) {
          Object.keys(publicModule).forEach((key: string) => {
            if (key === funName) {
              Object.assign(data, {
                [item]: function (...p: any) {
                  return publicModule[key].apply(this, [...params, ...p])
                }
              })
              temp = true;
            }
          })
        }
        if (!temp) data[item] = () => { }
      }
      if (value instanceof Object) {
        // console.log(value)
        this.parsingData(value, selfModule, parentModule, publicModule, page);
      }
    })
  }
}

export default compiler;