<template>
  <div class="mamage-content">
    <Header></Header>
    <Sidebar></Sidebar>
    <div class="content-view">
      <Menu></Menu>
      <router-view></router-view>
    </div>
    <setting-drawer v-if="!production"></setting-drawer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Header from './components/header.vue';
import Sidebar from './components/sidebar.vue';
import Menu from './components/menu.vue';
import SettingDrawer from '@/components/SettingDrawer/index';

@Component({
  components: { Header, Sidebar, Menu, SettingDrawer}
})
export default class MyComponent extends Vue {

  public get production() {
    return false;
  }
 
  mounted() {
    
  }
}
</script>

<style lang="less" scoped>

.mamage-content{
  background-color: @base-background;
    min-height: 100vh;
}
.content-view{
  position: absolute;
  width: calc(100% - @sidebar-width);
  top: @header-height;
  left: @sidebar-width;
  background-color: rgba(245, 245, 245, 1);
  min-height: calc(100% - @header-height);
  box-sizing: border-box;
  border-radius: 10px 0 0 0;
  padding: 15px 15px;
}
</style>