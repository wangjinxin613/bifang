<template>
  <div>
    <div class="sidebar customBar">
      <div
        :class="[item.path === active ? 'active': '', 'single']"
        v-for="(item, index) in menus"
        :key="index"
        @click="clickTitle(index)"
      >
        <div class="selectBorder"></div>
        <a-icon :type="item.meta.icon" class="icon" v-if="item.meta " />
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { menuConfig } from "@/router/index";
import { RouteConfig } from 'vue-router';

@Component({})
export default class MyComponent extends Vue {

  get menus(): Array<RouteConfig> {
    return menuConfig;
  }

  get active(): string {
    const basicRoute = this.$route.matched[1];
    return basicRoute.path ?? "";
  }

  public clickTitle(key: number) {
    if(this.active !== this.menus[key].path) {
      this.$router.push({
        path: this.menus[key].path
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar {
  position: fixed;
  left: 0;
  background: @base-background;
  top: @header-height;
  width: @sidebar-width;
  height: calc(100% - @header-height);
  overflow-y: auto;

  & .single {
    height: 85px;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    cursor: pointer;
    position: relative;

    & .icon {
      font-size: 28px;
    }

    & span {
      margin-top: 5px;
    }

    .selectBorder {
      box-sizing: border-box;
      width: 0;
      position: absolute;
      left: 0px;
      top: 0px;
      height: 85px;
      background: #4890f7;
      transition: all 0.3s;
    }

    &:hover,
    &.active {
      background: rgba(72, 144, 247, 0.2);

      .selectBorder {
        width: 5px;
      }
    }
  }
}
</style>