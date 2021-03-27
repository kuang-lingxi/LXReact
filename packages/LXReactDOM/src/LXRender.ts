import { LXComponent } from "../../LXReact/src/LXBaseComponent";
import { lxCreateElement } from "../../LXReact/src/LXElement";
import { LXReactComponentType, LXReactElementType, LXVirtualDOMType } from "../../type/Component";

export let globalVirtualDOM = null;

function createTextNode(text: string) {
  return document.createTextNode(text);
}

function createDOM(type: string) {
  return document.createElement(type)
}

function setAttribute(dom, props) {
  const regexpEvent = /^on([A-Z][a-zA-Z]*$)/;
  Object.keys(props).forEach((key) => {
    switch (key) {
      case 'style':
        Object.keys(props[key]).forEach((styleKey) => {
          dom.style[styleKey] = props[key][styleKey];
        });
        break;
      case 'className':
        dom.className = props[key];
        break;
      default:
        if(regexpEvent.test(key)) {
          const event = regexpEvent.exec(key)[1].toLowerCase();
          dom.addEventListener(event, props[key]);
          break;
        }
        dom.setAttribute(key, props[key]);
    }
  });
}

export function getElement(elementType, props) {
    if(typeof elementType === 'function') {
    const isComponent = (elementType as any)?.isComponent || false;

    if(isComponent) {
      const instance = new (elementType as any)(props);
      const element = instance.render();
      return { element, instance };
    }

    return { element: (elementType as Function)(props), instance: null };
  }
}

export function renderVirtualNode(virtualNode: LXVirtualDOMType) {
  let dom;
  const { component, props, children } = virtualNode;
  if(component === 'text') {
    dom = createTextNode(virtualNode.props.__value);
  }else if(typeof component === 'function'){
    return renderVirtualNode(children[0]);
  }else {
    dom = createDOM(component);
    setAttribute(dom, props);
    children.forEach(virtualItem => dom.appendChild(renderVirtualNode(virtualItem)));
  }
  virtualNode.realDOM = dom;
  return dom;
}

export function updateClassComponent(instance: LXComponent) {
  const { virtualNode } = instance;
  updateVirtualDOM(virtualNode.children[0], instance.render());
  const oldDOM = virtualNode.children[0].realDOM;
  const newDOM = renderVirtualNode(virtualNode);
  const fatherDOM = oldDOM.parentNode;
  fatherDOM.replaceChild(newDOM, oldDOM);
  instance.virtualNode = virtualNode;
  virtualNode.realDOM = newDOM;
}

export function updateVirtualDOM(oldVirtualDOM: LXVirtualDOMType, element: LXReactElementType) {
  const { instance, component } = oldVirtualDOM;
  const newProps = {
    ...element.props,
    children: element.children,
  }
  if(instance) {
    // component 组件
    instance.props = newProps;
    oldVirtualDOM.props = element.props;
    return updateVirtualDOM(oldVirtualDOM.children[0], instance.render());
  }else if(typeof component === 'function'){
    // 函数组件
    oldVirtualDOM.props = element.props;
    return updateVirtualDOM(oldVirtualDOM.children[0], (component as Function)(newProps));
  }else {
    oldVirtualDOM.props = element.props;
    oldVirtualDOM.children.forEach((item, index) => {
      updateVirtualDOM(item, element.children[index])
    })
  }
}

export function initVirtualDOM(element: LXReactElementType): LXVirtualDOMType {
  const genNode = (fatherVirtual: LXVirtualDOMType, elementItem: LXReactElementType) => {
    const { component, props, children } = elementItem;
    let virtualNode;
    if(typeof component === 'function') {
      const { element, instance } = getElement(component, { ...props, children });
      virtualNode = {
        ...elementItem,
        father: fatherVirtual,
        children: [ initVirtualDOM(element) ],
        name: component.name,
        instance,
      }
      if(instance) {
        instance.virtualNode = virtualNode;
        instance.forceUpdate = () => {updateClassComponent(instance)}
      }
    }else {
      virtualNode = {
        ...elementItem,
        father: fatherVirtual,
        children: [],
        name: component
      }
      virtualNode.children = elementItem.children.map(item => genNode(virtualNode, item));
    }

    return virtualNode;
  }

  return genNode(null, element);
}

export function render(Component: LXReactComponentType, root: HTMLElement) {
  globalVirtualDOM = initVirtualDOM(lxCreateElement(Component, {}, {}));
  root.appendChild(renderVirtualNode(globalVirtualDOM));
}
