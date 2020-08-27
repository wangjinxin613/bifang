import { Component, Prop } from "vue-property-decorator";
import * as tsx from "vue-tsx-support";

@Component
export default class extends tsx.Component<any> {

  protected render() {
    return (
      <div>
        <p>test</p>
      </div>
    );
  }
}