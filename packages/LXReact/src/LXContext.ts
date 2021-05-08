import { CustomComponent } from "../../type/Component"
import { LXComponent, lxCreateElement } from "./LXReact"

export const contextList = [];

export function setContext({ component, props }) {
  if(component.name === CustomComponent.Provider) {
    const contextId = (component as LXContextComponentClass).contextId;
    contextList.unshift({ [contextId as any]: { value: props.value } })
  }
}

export function deleteContext({ component }) {
  if(component.name === CustomComponent.Provider) {
    const contextId = (component as LXContextComponentClass).contextId;
    const index = contextList.findIndex(item => Object.prototype.hasOwnProperty.call(item, contextId));
    contextList.splice(index, 1);
  }
}

export function getContext() {
  const res = {};
  contextList.forEach(item => {
    const contextId = Object.getOwnPropertySymbols(item)[0];
    if(!Object.prototype.hasOwnProperty.call(res, contextId)) {
      res[contextId] = item[contextId];
    }
  })

  return res;
}


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
      return lxCreateElement(CustomComponent.Fragment, null, this.props.children);
    }
  }

  class Consumer extends LXContextComponent {
    static contextId = id;

    render() {
      const { children, value } = this.props;
      return lxCreateElement(CustomComponent.Fragment, null, children[0](value));
    }
  }

  return {
    Provider,
    Consumer
  }
}