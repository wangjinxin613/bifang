<template>
  <div>
    <header>
      <div class="left-view">
        <img src="@/assets/logo.png" class="logo"/>
        <span class="logo-text">鑫和煤炭供应链大数据平台</span>
      </div>
      <div class="right-view">
        <a-icon :component="SvgNotice" class="notice-icon"/>
        <a-dropdown :trigger="['click']">
        <div class="userInfo ant-dropdown-link" >
          <a-avatar icon="user"  size="small"/>
          <span class="span">超级管理员</span>
          <a-icon type="caret-down" />
        </div>
         <a-menu slot="overlay">
          <a-menu-item key="0">
            修改用户信息
          </a-menu-item>
          <a-menu-item key="1">
            退出登录
          </a-menu-item>
        </a-menu>
        </a-dropdown>
      </div>
    </header>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import svg from '@/mixins/svg';

@Component({
  mixins: [svg]
})
export default class MyComponent extends Vue{

}
</script>

<style lang="less" scoped>

header{
  background: @base-background;
  display: flex;
  justify-content: space-between;
  height: @header-height;
  padding: 0 40px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;

  & .left-view, & .right-view{
    display: flex;
    align-items: center;

    & .logo {
      width: 35px;
      height: 35px;
      cursor: pointer;
    }

    & .logo-text {
      margin-left: 20px;
      font-size: 24px;
      color: #fff;
    }

    & .notice-icon{
      font-size: 26px;
      color: #fff;
      cursor: pointer;
    }

    & .userInfo{
      display: flex;
      padding: 5px 8px;
      align-items: center;
      background: rgba(45, 65, 95, 1);
      color: #fff;
      border-radius: 1000px;
      margin-left: 30px;
      cursor: pointer;

      & .span{
        padding: 0 8px;
        font-size: 12px;
      }
    }
  }
}
</style>