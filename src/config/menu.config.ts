/**
 * 菜单从manageRouter（管理路由）中获取
 * meta.notMenu 为 true时不显示改菜单及其子菜单
 *  */ 
import { manageRouter } from './router.config';

var menus = manageRouter[0].children;

for(let i = menus!.length - 1; i >= 0; i--) {
  if(menus![i].meta?.notMenu) {
    menus?.splice(i, 1);
  }
}

export default menus;