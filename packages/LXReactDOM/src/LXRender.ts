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

export function renderVirtualNode(virtualNode: LXVirtualDOMType, cb = () => {}) {
  let dom;
  const { component, props, children } = virtualNode;
  if(component === 'text') {
    dom = createTextNode(virtualNode.props.__value);
  }else if(typeof component === 'function'){
    let comCb = cb;
    if(virtualNode.instance) {
      comCb = () => {
        virtualNode.instance.componentDidMount();
        cb();
      }
    }
    return renderVirtualNode(children[0], comCb);
  }else {
    dom = createDOM(component);
    setAttribute(dom, props);
    children.forEach(virtualItem => dom.appendChild(renderVirtualNode(virtualItem)));
  }
  virtualNode.realDOM = dom;
  cb();
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

export function cloneVirtualDOM(oldVirtualDOM: LXVirtualDOMType, props) {
  return {
    ...oldVirtualDOM,
    props
  }
}

export function updateVirtualDOM(oldVirtualDOM: LXVirtualDOMType, element: LXReactElementType) {
  const newProps = {
    ...element.props,
    children: element.children,
  }

  const newVirtualNode = cloneVirtualDOM(oldVirtualDOM, newProps);
  const { instance, component, name, key, children } = newVirtualNode;
  // 组件名不对应或者 key 改变了直接重新生成 virtualDOM
  if(name !== element.name || element.key !== key) {
    const { father: fatherVirtualNode } =  newVirtualNode;
    const index = fatherVirtualNode.children.findIndex(item => item === newVirtualNode);
    fatherVirtualNode.children.splice(index, 1, initVirtualDOM(element));
    return ;
  }

  if(instance) {
    // component 组件
    instance.componentWillReceiveProps(element.props);
    instance.props = newProps;
    oldVirtualDOM.props = element.props;
    return updateVirtualDOM(oldVirtualDOM.children[0], instance.render());
  }else if(typeof component === 'function'){
    // 函数组件
    oldVirtualDOM.props = element.props;
    return updateVirtualDOM(oldVirtualDOM.children[0], (component as Function)(newProps));
  }

  let newChildIndex = 0, newChildrenLen = children.length;
  for(; newChildIndex < newChildrenLen; newChildIndex++) {
    const child = children[newChildIndex];
    const { name: childName } = child;
    const elementChild = element.children[newChildIndex];
    if(elementChild && childName === elementChild.name) {
      updateVirtualDOM(child, elementChild);
    }else {
      break;
    }
  }

  // 如果 element 的 children 数组里面还有, 证明这次新加了结点
  if(newChildIndex === newChildrenLen && newChildIndex <= element.children.length) {
    for(let i = newChildIndex; i < element.children.length; i++) {
      newVirtualNode.children.push(initVirtualDOM(element.children[i]));
    }

    return ;
  }

  // 如果还有结点没有遍历完, 但是 element 的 children 数组里面已经没有了, 证明这次删除了结点
  if(newChildIndex < newChildrenLen && newChildIndex === element.children.length) {
    newVirtualNode.children =  newVirtualNode.children.slice(0, newChildIndex)

    return ;
  }

  // 如果两边都没有遍历完但是退出了循环, 证明中间某个结点被改变了, 此时用 key 去找对应的结点
  const childMap = new Map();
  for(let i = newChildIndex; i < newChildrenLen; i++) {
    const node = children[i];
    childMap.set(node.key, node);
  }

  newVirtualNode.children = newVirtualNode.children.slice(0, newChildIndex);

  for(let i = newChildIndex; i < element.children.length; i++) {
    const node = element.children[i];
    const { key } = node;
    if(childMap.has(key)) {
      const virtualDOM = childMap.get(key);
      updateVirtualDOM(virtualDOM, node);
      newVirtualNode.children.push(virtualDOM);
    }else {
      newVirtualNode.children.push(initVirtualDOM(node));
    }
  }
}

export function initVirtualDOM(element: LXReactElementType): LXVirtualDOMType {
  const genNode = (fatherVirtual: LXVirtualDOMType, elementItem: LXReactElementType) => {
    const { component, props, children } = elementItem;
    let virtualNode;
    if(typeof component === 'function') {
      const { element, instance } = getElement(component, { ...props, children });
      if(instance) {
        instance.virtualNode = virtualNode;
        instance.forceUpdate = () => {updateClassComponent(instance)}
        instance.componentWillMount();
      }
      virtualNode = {
        key: null,
        ...elementItem,
        father: fatherVirtual,
        children: [ initVirtualDOM(element) ],
        name: component.name,
        instance,
      }
    }else {
      virtualNode = {
        key: null,
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
  const element = lxCreateElement(Component, {}, {});
  globalVirtualDOM = initVirtualDOM(element);
  root.appendChild(renderVirtualNode(globalVirtualDOM));
}
