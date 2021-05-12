/* eslint-disable no-unused-vars */
import { CustomComponent, LXComponentAbstract } from "../../type/Component";
import { lxCreateElement } from "./LXReact";

export class LXComponent extends LXComponentAbstract {
  render(): any {}
}
export class LXPurComponent extends LXComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {}
}

export class Fragment extends LXComponent {
  render() {
    return lxCreateElement(CustomComponent.Fragment, null, this.props.children);
  }
}