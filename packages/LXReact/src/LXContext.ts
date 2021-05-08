import { CustomComponent } from "../../type/Component"
import { LXComponent, lxCreateElement } from "./LXReact"

export abstract class LXContextComponent extends LXComponent {
  static contextId: Symbol;
}

class _ extends LXContextComponent {
  render(){}
}

export type LXContextComponentClass = typeof _;

export const createLXContext = () => {
  const id = Symbol('lxContext');
  class Provider extends LXContextComponent {
    static contextId = id;

    render() {
      return lxCreateElement(CustomComponent.Fragment, this.props, this.props.children);
    }
  }

  class Consumer extends LXContextComponent {
    static contextId = id;

    render() {
      const { children, value } = this.props;

      return lxCreateElement(CustomComponent.Fragment, this.props, children(value));
    }
  }

  return {
    Provider,
    Consumer
  }
}