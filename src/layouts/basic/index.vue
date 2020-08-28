<template>
  <div class="mamage-content">
    <Header></Header>
    <Sidebar></Sidebar>
    <div class="content-view">
      <Menu></Menu>
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="ts">
import { Vue, Component } from 'vue-property-decorator'
import Header from './components/header';
import Sidebar from './components/sidebar';
import Menu from './components/menu';

@Component({
  components: { Header, Sidebar, Menu }
})
export default class MyComponent extends Vue {

}
</script>

<style lang="less" scoped>

.mamage-content{
  background-color: @base-background;
    min-height: 100vh;
}
.content-view{
  position: fixed;
  width: calc(100% - @sidebar-width);
  top: @header-height;
  left: @sidebar-width;
  background-color: rgba(245, 245, 245, 1);
  min-height: 100%;
  box-sizing: border-box;
  border-radius: 10px 0 0 0;
  padding: 15px 15px;
}
</style>