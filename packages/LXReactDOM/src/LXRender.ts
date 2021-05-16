import { LXComponent } from "../../LXReact/src/LXBaseComponent";
import { getContextId, checkUpdateList, deleteContext, getContext, setContext, initContext } from "../../LXReact/src/LXContext";
import { lxCreateElement } from "../../LXReact/src/LXElement";
import { share } from "lx-react-share";
import { CustomComponent, LXComponentClass, LXContextComponentClass, LXReactElementType, LXVirtualDOMType, PhaseEnum, Update } from "../../type/Component";

let globalVirtualDOM = null;

const regexpEvent = /^on([A-Z][a-zA-Z]*$)/;

const formList = [ 'input', 'select', 'textarea' ];

let updateList: Update[] = [];

let contextUpdateList = [];

let updateContext = false;


export function hasProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function setObjectProps(obj, props) {
  Object.assign(obj, props);
}

export function bindFormValue(dom, props) {
  setTimeout(() => {
    hasProperty(props, 'value') && (dom.value = props['value']);
  }, 0);
  const oldInput = props['onInput'];
  const onChange = hasProperty(props, 'onChange') ? props['onChange'] : () => {};
  delete props['onChange'];
  props['onInput'] = (e) => {
    oldInput && oldInput(e);
    onChange(e) ;
    hasProperty(props, 'value') && (dom.value = props['value']);
  };
}

function isForm(dom) {
  return formList.includes((dom.nodeName).toLowerCase());
}

function createTextNode(text: string) {
  return document.createTextNode(text);
}

function createDOM(type: string) {
  if(type === CustomComponent.Fragment) {
    return document.createDocumentFragment();
  }
  return document.createElement(type);
}

function setAttribute(dom, props) {
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
        }else {
          dom.setAttribute(key, props[key]);
        }
    }
  });
}

function updateAttribute(dom, oldProps, newProps) {
  // 表单属性需要做一些特别处理
  if(isForm(dom)) {
    bindFormValue(dom, newProps);
  }
  const addProps = {};
  // 找到新 props 里面可以复用的, 和新增的
  Object.keys(newProps).forEach(key => {
    if(key in oldProps) {
      switch (key) {
        case 'style':
          addProps[key] = newProps[key];
          break;
        case 'className':
          if(oldProps[key] !== newProps[key]) {
            dom.className = newProps[key];
          }
          break;
        default:
          if(regexpEvent.test(key)) {
            if(oldProps[key] !== newProps[key]) {
              const event = regexpEvent.exec(key)[1].toLowerCase();
              dom.removeEventListener(event, oldProps[key]);
              dom.addEventListener(event, newProps[key]);
            }
            break;
          }
          dom.setAttribute(key, newProps[key]);
      }
    }else {
      addProps[key] = newProps[key];
    }
  })
  setAttribute(dom, addProps);
  // 找到旧 props 里面需要删除的
  Object.keys(oldProps || {}).forEach(key => {
    if(!(key in newProps)) {
      if(regexpEvent.test(key)) {
        const event = regexpEvent.exec(key)[1].toLowerCase();
        dom.removeEventListener(event, oldProps[key]);
      }else {
        dom.removeAttribute(key);
      }
    }
  })
}

export function getElement({ elementType, props }) {
  if(typeof elementType === 'function') {
    const context = getContext();
    if(elementType.name === CustomComponent.Consumer) {
      const contextId = (elementType as LXContextComponentClass).contextId;
      const value = context[contextId as any].value
      const instance = new (elementType as LXContextComponentClass)({ value, ...props });
      const element = instance.render();

      return { instance, element };
    }

    const isComponent = elementType?.isComponent || false;

    if(isComponent) {
      const instance = new elementType(props);
      if(Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(instance).constructor, 'contextType')) {
        const contextId = Object.getPrototypeOf(instance).constructor.contextType.Consumer.contextId;
        if(Object.prototype.hasOwnProperty.call(context, contextId)) {
          instance.context = context[contextId].value;
        }
      }

      const element = instance.render();
      return { element, instance };
    }

    return { element: elementType(props), instance: null };
  }
}

export function renderVirtualNode(virtualNode: LXVirtualDOMType, fatherDOM: HTMLElement | DocumentFragment) {
  let dom;
  const { component, props, children, instance, ref } = virtualNode;
  if(component === 'text') {
    dom = createTextNode(virtualNode.props.__value);
    virtualNode.realDOM = dom;
  }else if(typeof component === 'function'){
    dom = renderVirtualNode(children[0], fatherDOM);
    children[0].realDOM = dom;
    if(instance) {
      instance.componentDidMount();
    }
    return dom;
  }else {
    dom = createDOM(component);
    // 表单属性需要做一些特别处理
    if(isForm(dom)) {
      bindFormValue(dom, props);
    }
    setAttribute(dom, props);
    children.forEach(virtualItem => {
      renderVirtualNode(virtualItem, dom);
    });
    virtualNode.realDOM = dom;
  }

  if(ref) {
    ref.current = dom;
  }

  fatherDOM.appendChild(dom);
  return dom;
}

export function updateRealDOM(virtualNode: LXVirtualDOMType) {
  const { realDOM: dom, component, props } = virtualNode;
  if(typeof component === 'function') {
    return ;
  }

  if(component === 'text') {
    dom.nodeValue = props.__value;
  }else {
    updateAttribute(dom, virtualNode.oldProps, virtualNode.props);
  }

  return ;
}

export function updateListDOM(virtualNode: LXVirtualDOMType) {
  let { realDOM: dom } = virtualNode;
  const { component, props } = virtualNode;
  if(typeof component === 'function') {
    dom = virtualNode.children[0].realDOM;
  }else if(component === 'text') {
    dom.nodeValue = props.__value;
  }else {
    updateAttribute(dom, virtualNode.oldProps, virtualNode.props);
  }

  const fatherDOM = dom.parentNode;
  fatherDOM.appendChild(dom);

  return ;
}

export function deleteRealDOM(oldVirtualDOM: LXVirtualDOMType) {
  const realDOM = oldVirtualDOM.realDOM || oldVirtualDOM.children[0].realDOM;
  const parentDOM = realDOM.parentNode;
  parentDOM.removeChild(realDOM);
}

export function insertRealDOM(newVirtualDOM: LXVirtualDOMType) {
  const fatherNode = getInsertFatherNode(newVirtualDOM);
  renderVirtualNode(newVirtualDOM, fatherNode.realDOM);
}

export function replaceRealDOM(oldVirtualDOM: LXVirtualDOMType, newVirtualDOM: LXVirtualDOMType){
  const oldRealDOM = getActualVirtualNode(oldVirtualDOM).realDOM;
  const newRealDOM = renderVirtualNode(newVirtualDOM, document.createDocumentFragment());
  newVirtualDOM.realDOM = newRealDOM;
  oldRealDOM.replaceWith(newRealDOM);
}

export function commitUpdateList() {
  share.setPhase({
    phase:  PhaseEnum.COMMIT,
    virtualDOM: null,
  });
  updateList.forEach(update => {
    switch(update.type) {
      case 'update': updateRealDOM(update.newVirtualDOM);break;
      case 'delete': deleteRealDOM(update.oldVirtualDOM);break;
      case 'insert': insertRealDOM(update.newVirtualDOM);break;
      case 'listUpdate': updateListDOM(update.newVirtualDOM);break;
      case 'replace': replaceRealDOM(update.oldVirtualDOM, update.newVirtualDOM);break;
      default: break;
    }
  })
  share.deletePhase();
  updateList = [];
}

export function updateClassComponent(instance: LXComponent) {
  const { virtualNode } = instance;
  share.setState({
    nowVirtualDOM: virtualNode,
  });
  initContext(virtualNode.children[0].context);
  updateVirtualDOM(virtualNode.children[0], instance.render());
  share.setState({
    nowVirtualDOM: null,
  });
  commitUpdateList();
  initContext({});
}

export function updateFunctionComponent(virtualDOM: LXVirtualDOMType) {
  const { children,  elementProps, component } = virtualDOM;
  share.setPhase({
    phase: PhaseEnum.UPDATE,
    virtualDOM
  });
  initContext(virtualDOM.context);
  updateVirtualDOM(children[0], (component as Function)(elementProps));
  share.deletePhase();
  commitUpdateList();
  initContext({});
}

export function cloneVirtualDOM(oldVirtualDOM: LXVirtualDOMType, props) {
  return {
    ...oldVirtualDOM,
    oldProps: oldVirtualDOM.props,
    props
  };
}

export function getActualVirtualNode(virtualDOM: LXVirtualDOMType) {
  if(typeof virtualDOM.component === 'function') {
    return virtualDOM.children[0];
  }

  return virtualDOM;
}

export function getActualFatherNode(virtualDOM: LXVirtualDOMType) {
  const fatherNode = virtualDOM.father;

  if(typeof fatherNode.component === 'function') {
    return fatherNode.father;
  }

  return fatherNode;
}

export function getInsertFatherNode(virtualDOM: LXVirtualDOMType) {
  const fatherNode = virtualDOM.father;

  if(fatherNode?.realDOM && fatherNode.realDOM.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
    return fatherNode;
  }

  return getInsertFatherNode(fatherNode);
}

export function replaceChildVirtualDOM(oldChild: LXVirtualDOMType, newChild: LXVirtualDOMType) {
  const fatherVirtualDOM = oldChild.father;
  const index = fatherVirtualDOM.children.findIndex(item => item === oldChild);
  fatherVirtualDOM.children.splice(index, 1, newChild);
  newChild.father = fatherVirtualDOM;
}

export function updateVirtualDOM(oldVirtualNode: LXVirtualDOMType, element: LXReactElementType) {
  if(oldVirtualNode.props === element.props) {
    return oldVirtualNode;
  }
  const newVirtualNode = cloneVirtualDOM(oldVirtualNode, element.props);
  share.setPhase({
    phase: PhaseEnum.UPDATE,
    virtualDOM: newVirtualNode,
  });
  if(!updateContext && newVirtualNode.name === CustomComponent.Provider) {
    setContext({ component: element.component, props: element.props });
    if(newVirtualNode.props.value !== element.props.value) {
      contextUpdateList = checkUpdateList({ virtualDOM: oldVirtualNode, value: element.props.value });
      setTimeout(() => {
        updateContext = true;
        contextUpdateList.forEach(item => {
          if(item.name === CustomComponent.Consumer) {
            const id = item.component.contextId;
            item.instance.props = { ...item.instance.props, ...item.context[id] };
          }else {
            const id = getContextId(item.component.contextType);
            item.instance.context = item.context[id].value;
          }
          item.instance.forceUpdate();
        })
        updateContext = false;
      }, 0);
    }
  }
  newVirtualNode.context = {
    ...getContext(),
  };
  const newProps = {
    ...element.props,
    children: element.children,
  }
  // 组件名不对应或者 key 改变了直接重新生成 virtualDOM
  if(oldVirtualNode.name !== element.name || element.key !== oldVirtualNode.key) {
    const newVirtualNode = initVirtualDOM(element, isStatic(element, oldVirtualNode.father.static));
    replaceChildVirtualDOM(oldVirtualNode, newVirtualNode)
    updateList.push({
      type: 'replace',
      oldVirtualDOM: oldVirtualNode,
      newVirtualDOM: newVirtualNode,
    });
    return newVirtualNode;
  }
  // 修改 fatherVirtualDOM 的 child
  replaceChildVirtualDOM(oldVirtualNode, newVirtualNode);
  const { instance, component, name } = newVirtualNode;

  if(instance) {
    // component 组件
    instance.componentWillReceiveProps(element.props);
    const shouldComponentUpdate = instance.shouldComponentUpdate(element.props);
    if(!shouldComponentUpdate){
      return newVirtualNode;
    }
    instance.props = newProps;
    if(name === CustomComponent.Consumer) {
      const contextId = (component as LXContextComponentClass).contextId;
      const value = oldVirtualNode.father.context[contextId as any].value;
      instance.props = {
        value,
        ...newProps,
      }
    }
    
    if((newVirtualNode.component as any)?.contextType) {
      const contextId = getContextId((newVirtualNode.component as any)?.contextType);
      instance.context = newVirtualNode.context[contextId as any].value;
    }
    newVirtualNode.children = [ updateVirtualDOM(newVirtualNode.children[0], instance.render()) ];
    instance.virtualNode = newVirtualNode;
    return newVirtualNode;
  }else if(typeof component === 'function'){
    // 函数组件
    newVirtualNode.children = [ updateVirtualDOM(newVirtualNode.children[0], (component as Function)(newProps)) ];
    return newVirtualNode;
  }

  let oldChildIndex = 0, oldChildrenLen = oldVirtualNode.children.length;
  for(; oldChildIndex < oldChildrenLen; oldChildIndex++) {
    const child = oldVirtualNode.children[oldChildIndex];
    const { name: childName, key: childKey } = child;
    const elementChild = element.children[oldChildIndex];
    if(elementChild && childName === elementChild.name && childKey === elementChild.key) {
      const childVirtualNode = updateVirtualDOM(child, elementChild);
      if(childVirtualNode !== child) {
        if(!child.static) {
          updateList.push({
            type: 'update',
            newVirtualDOM: childVirtualNode,
          });
        }
        newVirtualNode.children[oldChildIndex] = childVirtualNode;
      }
    }else {
      break;
    }
  }

  if(oldChildIndex === oldChildrenLen && oldChildIndex === element.children.length) {
    return newVirtualNode;
  }

  // 如果 element 的 children 数组里面还有, 证明这次新加了结点
  if(oldChildIndex === oldChildrenLen && oldChildIndex <= element.children.length) {
    for(let i = oldChildIndex; i < element.children.length; i++) {
      const childVirtualNode = initVirtualDOM(element.children[i], newVirtualNode.static);
      childVirtualNode.father = newVirtualNode;
      newVirtualNode.children.push(childVirtualNode);
      updateList.push({
        type: 'insert',
        newVirtualDOM: childVirtualNode,
      });
    }

    return newVirtualNode;
  }

  // 如果还有结点没有遍历完, 但是 element 的 children 数组里面已经没有了, 证明这次删除了结点
  if(oldChildIndex < oldChildrenLen && oldChildIndex === element.children.length) {
    for(let i = oldChildIndex; i < oldChildrenLen; i++) {
      updateList.push({
        type: 'delete',
        oldVirtualDOM: oldVirtualNode.children[oldChildIndex],
      });
    }
    newVirtualNode.children =  newVirtualNode.children.slice(0, oldChildIndex);
    return newVirtualNode;
  }

  // 如果两边都没有遍历完但是退出了循环, 证明中间某个结点被改变了, 此时用 key 去找对应的结点
  const childMap = new Map();
  for(let i = oldChildIndex; i < oldChildrenLen; i++) {
    const node = oldVirtualNode.children[i];
    if(node.key) {
      childMap.set(node.key, node);
    }else {
      updateList.push({
        type: 'delete',
        oldVirtualDOM: node
      })
    }
  }

  newVirtualNode.children = newVirtualNode.children.slice(0, oldChildIndex);

  // TODO: 可以优化, 避免不需要的 DOM 移动
  for(let i = oldChildIndex; i < element.children.length; i++) {
    const node = element.children[i];
    const { key, name } = node;
    if(childMap.has(key) && childMap.get(key).name === name) {
      // 能找到就放进来
      const childVirtualNode = childMap.get(key);
      const newChildVirtualNode = updateVirtualDOM(childVirtualNode, node);
      if(newChildVirtualNode !== childVirtualNode) {
        newVirtualNode.children.push(childVirtualNode);
        childMap.delete(key);
        updateList.push({
          type: 'listUpdate',
          newVirtualDOM: childVirtualNode
        });
      }

    }else {
      // 找不到直接新建
      const childVirtualNode = initVirtualDOM(node, newVirtualNode.static);
      childVirtualNode.father = newVirtualNode;
      newVirtualNode.children.push(childVirtualNode);
      updateList.push({
        type: 'insert',
        newVirtualDOM: childVirtualNode
      });
    }
  }

  childMap.forEach((value) => {
    updateList.push({
      type: 'delete',
      oldVirtualDOM: value,
    })
  })
  share.deletePhase();
  return newVirtualNode;
}

function isStatic(element: LXReactElementType, hasStaticFather: boolean) {
  return typeof element.props?.static === 'boolean' ? element.props.static : hasStaticFather;
}

export function initVirtualDOM(element: LXReactElementType, hasStaticFather = false): LXVirtualDOMType {
  const fatherStatic = isStatic(element, hasStaticFather);
  const genNode = (fatherVirtual: LXVirtualDOMType, elementItem: LXReactElementType, hasStaticFather = false) => {
    const { component, props, children, ref } = elementItem;
    const nodeStatic = isStatic(elementItem, hasStaticFather);
    let virtualNode = {} as LXVirtualDOMType;
    share.setPhase({
      phase: PhaseEnum.INIT,
      virtualDOM: virtualNode,
    });
    if(typeof component === 'function') {
      setContext({ component, props });
      setObjectProps(virtualNode, {
        context: {
          ...getContext(),
        }
      });
      const { element, instance } = getElement({ 
        elementType: component, 
        props: { 
          ...props, 
          children 
        },
      });
      setObjectProps(virtualNode, {
        key: null,
        ...elementItem,
        elementProps: {
          ...props,
          children,
        },
        father: fatherVirtual,
        children: [],
        instance,
        static: nodeStatic,
      });
      if(instance) {
        instance.componentWillMount();
      }
      const childVirtualNode = initVirtualDOM(element, nodeStatic);
      deleteContext({ component });
      childVirtualNode.father = virtualNode;
      virtualNode.children = [ childVirtualNode ];
      if(instance) {
        if(ref) {
          ref.current = instance;
        }
        instance.virtualNode = virtualNode;
        instance.forceUpdate = () => { 
          updateClassComponent(instance) 
        }
      }
    }else {
      setObjectProps(virtualNode, {
        key: null,
        ...elementItem,
        father: fatherVirtual,
        children: [],
        static: nodeStatic,
        context: {
          ...getContext(),
        }
      });
      virtualNode.children = elementItem.children.map(item => genNode(virtualNode, item, nodeStatic));
    }
    share.deletePhase();
    return virtualNode;
  }
  return genNode(null, element, fatherStatic);
}

export function render(Component: LXComponentClass, root: HTMLElement) {
  globalVirtualDOM = initVirtualDOM(lxCreateElement(Component, {}, {}));
  console.log("globalVirtualDOM", globalVirtualDOM);
  share.setPhase({
    phase:  PhaseEnum.COMMIT,
    virtualDOM: null,
  });
  renderVirtualNode(globalVirtualDOM, root);
  share.deletePhase();
  initContext({});
}
