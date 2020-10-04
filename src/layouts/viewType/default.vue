<template>
    <div class="content" v-if="showPage">
      <div v-for="(item, index) in templateType" :key="index">
        <router-view ref="content" :name="item.name" v-if="templateName == item.name" />
      </div>
        <!-- <router-view ref="content" name="list" v-if="templateName == 'list'" />
        <router-view ref="content" name="form" v-if="templateName == 'form'" />
        <router-view ref="content" name="see" v-if="templateName == 'see'" /> -->
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { templateType } from '@/config/router.config';

@Component({
  components: { }
})
export default class MyComponent extends Vue {
  public showPage = true;
  public templateName = 'default';
  public templateType = templateType;
  $bus: any;

  @Watch('$route', { immediate: true, deep: true })
  public onRouteWacth(){
    this.getTemplateName();
    this.refresh();
  }

  // 刷新路由
  public refresh() {
    this.showPage = false;
    this.$nextTick(() => {
      this.showPage = true;
    });
  }

  // 获取当前的模板路由的name
  public getTemplateName() {
    if (typeof this.$route.meta.template != 'undefined' && this.$route.meta.type != '') {
      this.templateName = this.$route.meta.template;
    } else {
      this.templateName = 'default';
    }
  }

  public mounted() {
    this.$bus.$on("refresh", () => {
      this.refresh();
    })
  }

}
</script>

