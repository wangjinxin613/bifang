<template>
  <div class="setting-drawer" ref="settingDrawer">
    <a-drawer
      width="300"
      placement="right"
      @close="onClose"
      :closable="false"
      :visible="visible"
      :handle="handle"
    >
      <div class="setting-drawer-index-content">
        <div :style="{ marginTop: '24px' }">
          <a-list :split="false">
            <a-list-item>
              <a-tooltip slot="actions">
                <template slot="title">该设定仅 [开发版] 有效</template>
                <a-select
                  size="small"
                  style="width: 100px;"
                  :defaultValue="defaultApi"
                  @change="handleApiChange"
                >
                  <a-select-option v-for="(item, index) in apiLit" :key="index" :value="item.value">{{ item.name }}</a-select-option>
                </a-select>
              </a-tooltip>
              <a-list-item-meta>
                <div slot="title">接口地址</div>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </div>
        <a-divider />

        <!-- <div :style="{ marginBottom: '24px' }">
          <a-button @click="doCopy" icon="copy" block>拷贝设置</a-button>
          <a-alert type="warning" :style="{ marginTop: '24px' }">
            <span slot="message">
              配置栏只在开发环境用于预览，生产环境不会展现，请手动修改配置文件
              <a
                href="https://github.com/sendya/ant-design-pro-vue/blob/master/src/config/defaultSettings.js"
                target="_blank"
              >src/config/defaultSettings.js</a>
            </span>
          </a-alert>
        </div> -->
      </div>
      <div class="setting-drawer-index-handle" @click="toggle">
        <a-icon type="setting" v-if="!visible" />
        <a-icon type="close" v-else />
      </div>
    </a-drawer>
  </div>
</template>

<script>
import setting  from '@/mixins/setting';

export default {
  mixins: [setting],
  data() {
    return {
      visible: false,
      handle: <div />,
    };
  },
  computed: {
    apiLit() {
      return [
        {
          name: '文正',
          value: process.env.VUE_APP_BASE_TEST_API1
        },
        {
          name: '模拟',
          value: process.env.VUE_APP_BASE_TEST_API2
        },
        {
          name: '开发',
          value: process.env.VUE_APP_API_BASE_URL
        }
      ]
    },
  },
  mounted() {
    console.log(this.defaultApi);
  },
  methods: {
    onClose() {
      this.visible = false;
    },
    toggle() {
      this.visible = !this.visible;
    },
    handleApiChange(value) {
      this.setDefaultApi(value);
      this.$bus.$emit("refresh");
    },
  },
};
</script>

<style lang="less" scoped>
.setting-drawer-index-content {
  .setting-drawer-index-blockChecbox {
    display: flex;

    .setting-drawer-index-item {
      margin-right: 16px;
      position: relative;
      border-radius: 4px;
      cursor: pointer;

      img {
        width: 48px;
      }

      .setting-drawer-index-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        padding-top: 15px;
        padding-left: 24px;
        height: 100%;
        color: #1890ff;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
  .setting-drawer-theme-color-colorBlock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    float: left;
    cursor: pointer;
    margin-right: 8px;
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    color: #fff;
    font-weight: 700;

    i {
      font-size: 14px;
    }
  }
}

.setting-drawer-index-handle {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: #1890ff;
  width: 48px;
  height: 48px;
  right: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  z-index: 1001;
  text-align: center;
  font-size: 16px;
  border-radius: 4px 0 0 4px;

  i {
    color: rgb(255, 255, 255);
    font-size: 20px;
  }
}
</style>
