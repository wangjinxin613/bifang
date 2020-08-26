<template>
  <div>
    <div class="menu">
      <div class="menuName">
        <div class="border"></div>
        <span>系统</span>
        <div class="border border2"></div>
      </div>
      <a-menu mode="horizontal">
        <a-menu-item key="1">用户管理</a-menu-item>
        <a-menu-item key="2">角色权限</a-menu-item>
        <a-menu-item key="3">审批管理</a-menu-item>
      </a-menu>
    </div>
  </div>
</template>

<style lang="less" scoped>
.menu {
  display: flex;

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
  }

  /deep/ .ant-menu {
    background: transparent;
  }
}
</style>