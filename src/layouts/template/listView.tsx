import { Vue, Component, Ref } from 'vue-property-decorator'
import * as tsx from "vue-tsx-support";
import './style/list.less';

@Component({})
export default class extends tsx.Component<any> {

  @Ref() content: any;

  protected render() {
    return (
      <div class="listView">
        <div class="top-view">
          <a-menu mode="horizontal">
            <a-menu-item >全部</a-menu-item>
          </a-menu>
          <div class="right-view">
            <a-button type="primary">
              Primary
            </a-button>
          </div>
        </div>
        <router-view ref="content"></router-view>
      </div>
    );
  }
}


