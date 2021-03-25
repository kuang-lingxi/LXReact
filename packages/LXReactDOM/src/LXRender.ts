import { LXComponent } from "../../LXReact/src/LXBaseComponent";
import { lxCreateElement } from "../../LXReact/src/LXElement";
import { LXReactComponentType, LXReactElementType, LXVirtualDOMType } from "../../type/Component";

let globalVirtualDOM = null;

function createTextNode(text: string) {
  return document.createTextNode(text);
}

function createDOM(type: string) {
  return document.createElement(type)
}

function setAttribute(dom, props) {
  Object.keys(props).forEach((key) => {
    switch (key) {
      case 'style':
        Object.keys(props[key]).forEach((styleKey) => {
          dom.style[styleKey] = props[key][styleKey];
        });
        break;
      case 'onClick':
        dom.addEventListener('click', (e) => {
          props[key](e);
        });
        break;
    }
  });
}

export function renderVirtualNode(virtualNode: LXVirtualDOMType) {
  let dom;
  const { type, props, children } = virtualNode;
  if(type === 'text') {
    dom = createTextNode(virtualNode.value);
  }else {
    dom = createDOM(type);
    setAttribute(dom, props);
    children.forEach(virtualItem => dom.appendChild(renderVirtualNode(virtualItem)));
  }
  virtualNode.realDOM = dom;
  return dom;
}

export function updateVirtualDOM(oldVirtualNode: LXVirtualDOMType, newVirtualNode: LXVirtualDOMType) {
  const fatherVirtualNode = oldVirtualNode.father;
  if(!fatherVirtualNode) {
    globalVirtualDOM = newVirtualNode;
    return ;
  }
  newVirtualNode.father = fatherVirtualNode;
  const index = fatherVirtualNode.children.findIndex(item => oldVirtualNode === item);
  fatherVirtualNode.children.splice(index, 1, newVirtualNode);
}

export function updateElement(instance: LXComponent) {
  const newVirtualNode = genVirtualDOM(instance.render());
  const newDOM = renderVirtualNode(newVirtualNode);
  const oldVirtualNode = instance.virtualNode;
  const oldDOM = oldVirtualNode.realDOM;
  const fatherDOM = oldDOM.parentNode;
  fatherDOM.replaceChild(newDOM, oldDOM);
  updateVirtualDOM(oldVirtualNode, newVirtualNode);
  instance.virtualNode = newVirtualNode;
  newVirtualNode.realDOM = newDOM;
}

export function genVirtualDOM(element: LXReactElementType): LXVirtualDOMType {
  const genNode = (fatherVirtual: LXVirtualDOMType, elementItem: LXReactElementType) => {
    const virtualNode = {
      ...elementItem,
      father: fatherVirtual,
      children: [],
    }
    virtualNode.children = elementItem.children.map(item => genNode(virtualNode, item));
    const instance = virtualNode.instance;
    if(instance) {
      instance.virtualNode = virtualNode;
      instance.forceUpdate = () => updateElement(instance);
    }
    return virtualNode;
  }

  return genNode(null, element);
}

export function render(Component: LXReactComponentType, root: HTMLElement) {
  const element = lxCreateElement(Component, {}, []);
  globalVirtualDOM = genVirtualDOM(element);
  root.appendChild(renderVirtualNode(globalVirtualDOM));
}
