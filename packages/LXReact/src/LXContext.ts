import { CustomComponent, LXContextComponent, LXContextComponentClass } from "../../type/Component"
import { lxCreateElement } from "./LXElement"

export let contextList = [];

export function initContext(context) {
  contextList = []
  Object.getOwnPropertySymbols(context).forEach(key => {
    contextList.push({ [key]: context[key] });
  })
}

export function getContextId({ Provider }) {
  return Provider.contextId;
}

export function checkUpdateList({ virtualDOM, value }) {
  const id = virtualDOM.component.contextId;
  function recursiveChild({ node, firstProvider }) {
    let list = [];
    if(!firstProvider && node.name === CustomComponent.Provider && node.component.contextId === id) {
      return [];
    }

    node.context[id].value = value;

    if(node.name === CustomComponent.Consumer && node.component.contextId === id) {
      list.push(node);
    }
  
    if(node.instance && node.component?.contextType && getContextId(node.component.contextType) === id) {
      list.push(node);
    }

    node.children.forEach(item => {
      list = list.concat(recursiveChild({ node: item, firstProvider: false }));
    });

    return list;
  }

  return recursiveChild({ node: virtualDOM, firstProvider: true });
}

export function setContext({ component, props }) {
  if(component.name === CustomComponent.Provider) {
    const contextId = (component as LXContextComponentClass).contextId;
    contextList.unshift({ [contextId as any]: { value: props.value } });
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