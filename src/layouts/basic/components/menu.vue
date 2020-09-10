<template>
  <div>
    <div class="menu">
      <div class="menuName">
        <div class="border"></div>
        <span>{{ title }}</span>
        <div class="border border2"></div>
      </div>
      <a-menu
        mode="horizontal"
        v-model="active"
        :multiple="false"
        :selectable="false"
        @click="titleClick"
      >
        <a-menu-item v-for="(item, index) in menus" :key="index">{{ item.name }}</a-menu-item>
      </a-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { menuConfig } from "@/router/index";
import { RouteConfig } from "vue-router";

@Component({})
export default class MyComponent extends Vue {
  // 二级菜单的菜单们
  get menus(): Array<RouteConfig> {
    const basicRoute = this.$route.matched[1];
    let menus: Array<RouteConfig> = [];
    for (const i in menuConfig) {
      if (menuConfig[i].path === basicRoute.path) {
        menus = menuConfig[i].children ?? [];
      }
    }
    return menus;
  }

  // 二级菜单哪个应该被选中
  get active(): Array<number> {
    const secondRoute = this.$route.matched[2];
    const { menus } = this;
    for (const i in menus) {
      if (menus[i].path === secondRoute.path) {
        return [Number(i)];
      }
    }
    return [];
  }

  get title(): string {
    const basicRoute = this.$route.matched[1];
    return basicRoute.name ?? "";
  }

  titleClick({ key }: never) {
    if (this.active[0] !== key) {
      this.$router.push({
        path: this.menus[key].path,
      });
    }
  }
}
</script>

<style lang="less" scoped>
.menu {
  display: flex;
  align-items: center;

  .menuName {
    display: flex;
    align-items: center;
    padding: 5px 0;

    & .border {
      width: 4px;
      height: 30px;
      background-color: rgb(72, 144, 247);
    }

    & .border2 {
      width: 1px;
      background-color: #ccc;
      margin-left: 20px;
      margin-right: 15px;
      height: 24px;
    }

    & span {
      font-size: 18px;
      margin-left: 14px;
      font-weight: bold;
      color: #333;
    }
  }

  /deep/ .ant-menu-horizontal {
    border-bottom: 0 !important;
    line-height: 30px;
  }

  /deep/ .ant-menu {
    background: transparent;
  }
}
</style>