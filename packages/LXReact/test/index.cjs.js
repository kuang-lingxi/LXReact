var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};

// packages/LXReact/dist/index.js
__markAsModule(exports);
__export(exports, {
  default: () => LXReact_default
});

// packages/LXShare/dist/index.js
var __defProp2 = Object.defineProperty;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __assign = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var PhaseEnum;
(function(PhaseEnum22) {
  PhaseEnum22["INIT"] = "init";
  PhaseEnum22["UPDATE"] = "update";
  PhaseEnum22["COMMIT"] = "commit";
  PhaseEnum22["FREE"] = "free";
})(PhaseEnum || (PhaseEnum = {}));
var LXComponentAbstract = class {
  constructor(props) {
    this.props = props;
    this.setState.bind(this);
  }
  forceUpdate() {
  }
  setState(state) {
    this.state = __assign(__assign({}, this.state), state);
    this.forceUpdate();
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  componentWillUpdate() {
  }
  componentDidUpdate() {
  }
};
LXComponentAbstract.isComponent = true;
var LXShare = class {
  constructor() {
    this.state = {
      phase: [PhaseEnum.FREE],
      virtualDOM: [null],
      hooksIndex: 0
    };
  }
  setState(data) {
    if (Object.prototype.toString.call(data) !== "[object Object]") {
      throw Error("data must be a object");
    }
    this.state = __assign(__assign({}, this.state), data);
  }
  getState() {
    return this.state;
  }
  setPhase({phase, virtualDOM}) {
    this.state.phase.unshift(phase);
    this.state.virtualDOM.unshift(virtualDOM);
  }
  deletePhase() {
    this.state.phase.shift();
    this.state.virtualDOM.shift();
    this.state.hooksIndex = 0;
  }
  addHooksIndex() {
    this.state.hooksIndex = this.state.hooksIndex + 1;
  }
};
var share = new LXShare();

// packages/LXReact/dist/index.js
var __defProp3 = Object.defineProperty;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp3(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __assign2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __export2 = (target, all) => {
  for (var name in all)
    __defProp3(target, name, {get: all[name], enumerable: true});
};
var LXReact_exports = {};
__export2(LXReact_exports, {
  Fragment: () => Fragment,
  LXComponent: () => LXComponent,
  LXPurComponent: () => LXPurComponent,
  createLXContext: () => createLXContext,
  createLXRef: () => createLXRef,
  lxCreateElement: () => lxCreateElement,
  useLXContext: () => useLXContext,
  useLXEffect: () => useLXEffect,
  useLXState: () => useLXState
});
var PhaseEnum2;
(function(PhaseEnum22) {
  PhaseEnum22["INIT"] = "init";
  PhaseEnum22["UPDATE"] = "update";
  PhaseEnum22["COMMIT"] = "commit";
  PhaseEnum22["FREE"] = "free";
})(PhaseEnum2 || (PhaseEnum2 = {}));
var HooksName = {
  STATE: "state",
  EFFECT: "effect",
  CONTEXT: "context"
};
var LXComponentAbstract2 = class {
  constructor(props) {
    this.props = props;
    this.setState.bind(this);
  }
  forceUpdate() {
  }
  setState(state) {
    this.state = __assign2(__assign2({}, this.state), state);
    this.forceUpdate();
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  componentWillUpdate() {
  }
  componentDidUpdate() {
  }
};
LXComponentAbstract2.isComponent = true;
var LXContextComponent = class extends LXComponentAbstract2 {
};
var CustomComponent = {
  Fragment: "Fragment",
  Provider: "Provider",
  Consumer: "Consumer"
};
function lxCreateElement(elementType, props, ...children) {
  const formatChildren = (child = []) => {
    return child.map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return {
          component: "text",
          children: [],
          props: {__value: item},
          name: "text",
          key: null,
          ref: null
        };
      }
      if (Array.isArray(item) && !(item == null ? void 0 : item.isChildren)) {
        item.forEach((itemChild, index) => {
          itemChild.key = "key" in itemChild && itemChild.key !== null ? itemChild.key : index;
        });
      }
      return item;
    });
  };
  const finalProps = props || {};
  const key = "key" in finalProps ? finalProps.key : null;
  const ref = "ref" in finalProps ? finalProps.ref : null;
  delete finalProps["key"];
  const element = {
    component: elementType,
    props: finalProps,
    children: formatChildren([...children]).flat(),
    name: typeof elementType === "function" ? elementType.name : elementType,
    key,
    ref
  };
  return element;
}
var contextList = [];
function getContextId({Provider}) {
  return Provider.contextId;
}
function checkUpdateList({virtualDOM, value}) {
  const id = virtualDOM.component.contextId;
  function recursiveChild({node, firstProvider}) {
    var _a;
    let list = [];
    if (!firstProvider && node.name === CustomComponent.Provider && node.component.contextId === id) {
      return [];
    }
    node.context[id].value = value;
    if (node.name === CustomComponent.Consumer && node.component.contextId === id) {
      list.push(node);
    }
    if (node.instance && ((_a = node.component) == null ? void 0 : _a.contextType) && getContextId(node.component.contextType) === id) {
      list.push(node);
    }
    node.children.forEach((item) => {
      list = list.concat(recursiveChild({node: item, firstProvider: false}));
    });
    return list;
  }
  return recursiveChild({node: virtualDOM, firstProvider: true});
}
function setContext({component, props}) {
  if (component.name === CustomComponent.Provider) {
    const contextId = component.contextId;
    contextList.unshift({[contextId]: {value: props.value}});
  }
}
function deleteContext({component}) {
  if (component.name === CustomComponent.Provider) {
    const contextId = component.contextId;
    const index = contextList.findIndex((item) => Object.prototype.hasOwnProperty.call(item, contextId));
    contextList.splice(index, 1);
  }
}
function getContext() {
  const res = {};
  contextList.forEach((item) => {
    const contextId = Object.getOwnPropertySymbols(item)[0];
    if (!Object.prototype.hasOwnProperty.call(res, contextId)) {
      res[contextId] = item[contextId];
    }
  });
  return res;
}
var createLXContext = () => {
  const id = Symbol("lxContext");
  class Provider extends LXContextComponent {
    render() {
      return lxCreateElement(CustomComponent.Fragment, null, this.props.children);
    }
  }
  Provider.contextId = id;
  class Consumer extends LXContextComponent {
    render() {
      const {children, value} = this.props;
      return lxCreateElement(CustomComponent.Fragment, null, children[0](value));
    }
  }
  Consumer.contextId = id;
  return {
    Provider,
    Consumer
  };
};
var LXComponent = class extends LXComponentAbstract2 {
  render() {
  }
};
var LXPurComponent = class extends LXComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  render() {
  }
};
var Fragment = class extends LXComponent {
  render() {
    return lxCreateElement(CustomComponent.Fragment, null, this.props.children);
  }
};
function createLXRef() {
  return {
    current: null
  };
}
var regexpEvent = /^on([A-Z][a-zA-Z]*$)/;
var formList = ["input", "select", "textarea"];
var updateList = [];
var contextUpdateList = [];
var updateContext = false;
function hasProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function setObjectProps(obj, props) {
  Object.assign(obj, props);
}
function bindFormValue(dom, props) {
  setTimeout(() => {
    hasProperty(props, "value") && (dom.value = props["value"]);
  }, 0);
  const oldInput = props["onInput"];
  const onChange = hasProperty(props, "onChange") ? props["onChange"] : () => {
  };
  delete props["onChange"];
  props["onInput"] = (e) => {
    oldInput && oldInput(e);
    onChange(e);
    hasProperty(props, "value") && (dom.value = props["value"]);
  };
}
function isForm(dom) {
  return formList.includes(dom.nodeName.toLowerCase());
}
function createTextNode(text) {
  return document.createTextNode(text);
}
function createDOM(type) {
  if (type === CustomComponent.Fragment) {
    return document.createDocumentFragment();
  }
  return document.createElement(type);
}
function setAttribute(dom, props) {
  Object.keys(props).forEach((key) => {
    switch (key) {
      case "style":
        Object.keys(props[key]).forEach((styleKey) => {
          dom.style[styleKey] = props[key][styleKey];
        });
        break;
      case "className":
        dom.className = props[key];
        break;
      default:
        if (regexpEvent.test(key)) {
          const event = regexpEvent.exec(key)[1].toLowerCase();
          dom.addEventListener(event, props[key]);
        } else {
          dom.setAttribute(key, props[key]);
        }
    }
  });
}
function updateAttribute(dom, oldProps, newProps) {
  if (isForm(dom)) {
    bindFormValue(dom, newProps);
  }
  const addProps = {};
  Object.keys(newProps).forEach((key) => {
    if (key in oldProps) {
      switch (key) {
        case "style":
          addProps[key] = newProps[key];
          break;
        case "className":
          if (oldProps[key] !== newProps[key]) {
            dom.className = newProps[key];
          }
          break;
        default:
          if (regexpEvent.test(key)) {
            if (oldProps[key] !== newProps[key]) {
              const event = regexpEvent.exec(key)[1].toLowerCase();
              dom.removeEventListener(event, oldProps[key]);
              dom.addEventListener(event, newProps[key]);
            }
            break;
          }
          dom.setAttribute(key, newProps[key]);
      }
    } else {
      addProps[key] = newProps[key];
    }
  });
  setAttribute(dom, addProps);
  Object.keys(oldProps || {}).forEach((key) => {
    if (!(key in newProps)) {
      if (regexpEvent.test(key)) {
        const event = regexpEvent.exec(key)[1].toLowerCase();
        dom.removeEventListener(event, oldProps[key]);
      } else {
        dom.removeAttribute(key);
      }
    }
  });
}
function getElement({fatherVirtualDOM, elementType, props}) {
  if (typeof elementType === "function") {
    if (elementType.name === CustomComponent.Consumer) {
      const contextId = elementType.contextId;
      const value = fatherVirtualDOM.context[contextId].value;
      const instance = new elementType(__assign2({value}, props));
      const element = instance.render();
      return {instance, element};
    }
    const isComponent = (elementType == null ? void 0 : elementType.isComponent) || false;
    if (isComponent) {
      const instance = new elementType(props);
      if (Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(instance).constructor, "contextType")) {
        const contextId = Object.getPrototypeOf(instance).constructor.contextType.Consumer.contextId;
        if (Object.prototype.hasOwnProperty.call(fatherVirtualDOM.context, contextId)) {
          instance.context = fatherVirtualDOM.context[contextId].value;
        }
      }
      const element = instance.render();
      return {element, instance};
    }
    return {element: elementType(props), instance: null};
  }
}
function renderVirtualNode(virtualNode, fatherDOM) {
  let dom;
  const {component, props, children, instance, ref} = virtualNode;
  if (component === "text") {
    dom = createTextNode(virtualNode.props.__value);
    virtualNode.realDOM = dom;
  } else if (typeof component === "function") {
    dom = renderVirtualNode(children[0], fatherDOM);
    children[0].realDOM = dom;
    if (instance) {
      instance.componentDidMount();
    }
    return dom;
  } else {
    dom = createDOM(component);
    if (isForm(dom)) {
      bindFormValue(dom, props);
    }
    setAttribute(dom, props);
    children.forEach((virtualItem) => {
      renderVirtualNode(virtualItem, dom);
    });
    virtualNode.realDOM = dom;
  }
  if (ref) {
    ref.current = dom;
  }
  fatherDOM.appendChild(dom);
  return dom;
}
function updateRealDOM(virtualNode) {
  const {realDOM: dom, component, props} = virtualNode;
  if (typeof component === "function") {
    return;
  }
  if (component === "text") {
    dom.nodeValue = props.__value;
  } else {
    updateAttribute(dom, virtualNode.oldProps, virtualNode.props);
  }
  return;
}
function updateListDOM(virtualNode) {
  let {realDOM: dom} = virtualNode;
  const {component, props} = virtualNode;
  if (typeof component === "function") {
    dom = virtualNode.children[0].realDOM;
  } else if (component === "text") {
    dom.nodeValue = props.__value;
  } else {
    updateAttribute(dom, virtualNode.oldProps, virtualNode.props);
  }
  const fatherDOM = dom.parentNode;
  fatherDOM.appendChild(dom);
  return;
}
function deleteRealDOM(oldVirtualDOM) {
  const realDOM = oldVirtualDOM.realDOM || oldVirtualDOM.children[0].realDOM;
  const parentDOM = realDOM.parentNode;
  parentDOM.removeChild(realDOM);
}
function insertRealDOM(newVirtualDOM) {
  const fatherNode = getActualFatherNode(newVirtualDOM);
  renderVirtualNode(newVirtualDOM, fatherNode.realDOM);
}
function replaceRealDOM(oldVirtualDOM, newVirtualDOM) {
  const oldRealDOM = getActualVirtualNode(oldVirtualDOM).realDOM;
  const newRealDOM = renderVirtualNode(newVirtualDOM, document.createDocumentFragment());
  newVirtualDOM.realDOM = newRealDOM;
  oldRealDOM.replaceWith(newRealDOM);
}
function commitUpdateList() {
  share.setPhase({
    phase: PhaseEnum2.COMMIT,
    virtualDOM: null
  });
  updateList.forEach((update) => {
    switch (update.type) {
      case "update":
        updateRealDOM(update.newVirtualDOM);
        break;
      case "delete":
        deleteRealDOM(update.oldVirtualDOM);
        break;
      case "insert":
        insertRealDOM(update.newVirtualDOM);
        break;
      case "listUpdate":
        updateListDOM(update.newVirtualDOM);
        break;
      case "replace":
        replaceRealDOM(update.oldVirtualDOM, update.newVirtualDOM);
        break;
      default:
        break;
    }
  });
  share.deletePhase();
  updateList = [];
}
function updateClassComponent(instance) {
  const {virtualNode} = instance;
  share.setState({
    nowVirtualDOM: virtualNode
  });
  updateVirtualDOM(virtualNode.children[0], instance.render());
  share.setState({
    nowVirtualDOM: null
  });
  commitUpdateList();
}
function updateFunctionComponent(virtualDOM) {
  const {children, elementProps, component} = virtualDOM;
  share.setPhase({
    phase: PhaseEnum2.UPDATE,
    virtualDOM
  });
  updateVirtualDOM(children[0], component(elementProps));
  share.deletePhase();
  commitUpdateList();
}
function cloneVirtualDOM(oldVirtualDOM, props) {
  return __assign2(__assign2({}, oldVirtualDOM), {
    oldProps: oldVirtualDOM.props,
    props
  });
}
function getActualVirtualNode(virtualDOM) {
  if (typeof virtualDOM.component === "function") {
    return virtualDOM.children[0];
  }
  return virtualDOM;
}
function getActualFatherNode(virtualDOM) {
  const fatherNode = virtualDOM.father;
  if (typeof fatherNode.component === "function") {
    return fatherNode.father;
  }
  return fatherNode;
}
function replaceChildVirtualDOM(oldChild, newChild) {
  const fatherVirtualDOM = oldChild.father;
  const index = fatherVirtualDOM.children.findIndex((item) => item === oldChild);
  fatherVirtualDOM.children.splice(index, 1, newChild);
  newChild.father = fatherVirtualDOM;
}
function updateVirtualDOM(oldVirtualNode, element) {
  console.log(oldVirtualNode.props === element.props);
  if (oldVirtualNode.props === element.props) {
    return oldVirtualNode;
  }
  const newVirtualNode = cloneVirtualDOM(oldVirtualNode, element.props);
  share.setPhase({
    phase: PhaseEnum2.UPDATE,
    virtualDOM: newVirtualNode
  });
  if (!updateContext && oldVirtualNode.name === CustomComponent.Provider) {
    if (oldVirtualNode.props.value !== element.props.value) {
      contextUpdateList = checkUpdateList({virtualDOM: oldVirtualNode, value: element.props.value});
      setTimeout(() => {
        updateContext = true;
        contextUpdateList.forEach((item) => {
          if (item.name === CustomComponent.Consumer) {
            const id = item.component.contextId;
            item.instance.props = __assign2(__assign2({}, item.instance.props), item.context[id]);
          } else {
            const id = getContextId(item.component.contextType);
            item.instance.context = item.context[id].value;
          }
          item.instance.forceUpdate();
        });
        updateContext = false;
      }, 0);
    }
  }
  const newProps = __assign2(__assign2({}, element.props), {
    children: element.children
  });
  if (oldVirtualNode.name !== element.name || element.key !== oldVirtualNode.key) {
    const newVirtualNode2 = initVirtualDOM(element, isStatic(element, oldVirtualNode.father.static));
    replaceChildVirtualDOM(oldVirtualNode, newVirtualNode2);
    updateList.push({
      type: "replace",
      oldVirtualDOM: oldVirtualNode,
      newVirtualDOM: newVirtualNode2
    });
    return newVirtualNode2;
  }
  replaceChildVirtualDOM(oldVirtualNode, newVirtualNode);
  const {instance, component, name} = newVirtualNode;
  if (instance) {
    instance.componentWillReceiveProps(element.props);
    const shouldComponentUpdate = instance.shouldComponentUpdate(element.props);
    if (!shouldComponentUpdate) {
      return newVirtualNode;
    }
    if (name === CustomComponent.Consumer) {
      const contextId = component.contextId;
      const value = oldVirtualNode.father.context[contextId].value;
      instance.props = __assign2({
        value
      }, newProps);
    } else {
      instance.props = newProps;
    }
    newVirtualNode.children = [updateVirtualDOM(newVirtualNode.children[0], instance.render())];
    instance.virtualNode = newVirtualNode;
    return newVirtualNode;
  } else if (typeof component === "function") {
    newVirtualNode.children = [updateVirtualDOM(newVirtualNode.children[0], component(newProps))];
    return newVirtualNode;
  }
  let oldChildIndex = 0, oldChildrenLen = oldVirtualNode.children.length;
  for (; oldChildIndex < oldChildrenLen; oldChildIndex++) {
    const child = oldVirtualNode.children[oldChildIndex];
    const {name: childName, key: childKey} = child;
    const elementChild = element.children[oldChildIndex];
    if (elementChild && childName === elementChild.name && childKey === elementChild.key) {
      const childVirtualNode = updateVirtualDOM(child, elementChild);
      if (childVirtualNode !== child) {
        if (!child.static) {
          updateList.push({
            type: "update",
            newVirtualDOM: childVirtualNode
          });
        }
        newVirtualNode.children[oldChildIndex] = childVirtualNode;
      }
    } else {
      break;
    }
  }
  if (oldChildIndex === oldChildrenLen && oldChildIndex === element.children.length) {
    return newVirtualNode;
  }
  if (oldChildIndex === oldChildrenLen && oldChildIndex <= element.children.length) {
    for (let i = oldChildIndex; i < element.children.length; i++) {
      const childVirtualNode = initVirtualDOM(element.children[i], newVirtualNode.static);
      childVirtualNode.father = newVirtualNode;
      newVirtualNode.children.push(childVirtualNode);
      updateList.push({
        type: "insert",
        newVirtualDOM: childVirtualNode
      });
    }
    return newVirtualNode;
  }
  if (oldChildIndex < oldChildrenLen && oldChildIndex === element.children.length) {
    for (let i = oldChildIndex; i < oldChildrenLen; i++) {
      updateList.push({
        type: "delete",
        oldVirtualDOM: oldVirtualNode.children[oldChildIndex]
      });
    }
    newVirtualNode.children = newVirtualNode.children.slice(0, oldChildIndex);
    return newVirtualNode;
  }
  const childMap = new Map();
  for (let i = oldChildIndex; i < oldChildrenLen; i++) {
    const node = oldVirtualNode.children[i];
    if (node.key) {
      childMap.set(node.key, node);
    } else {
      updateList.push({
        type: "delete",
        oldVirtualDOM: node
      });
    }
  }
  newVirtualNode.children = newVirtualNode.children.slice(0, oldChildIndex);
  for (let i = oldChildIndex; i < element.children.length; i++) {
    const node = element.children[i];
    const {key, name: name2} = node;
    if (childMap.has(key) && childMap.get(key).name === name2) {
      const childVirtualNode = childMap.get(key);
      const newChildVirtualNode = updateVirtualDOM(childVirtualNode, node);
      if (newChildVirtualNode !== childVirtualNode) {
        newVirtualNode.children.push(childVirtualNode);
        childMap.delete(key);
        updateList.push({
          type: "listUpdate",
          newVirtualDOM: childVirtualNode
        });
      }
    } else {
      const childVirtualNode = initVirtualDOM(node, newVirtualNode.static);
      childVirtualNode.father = newVirtualNode;
      newVirtualNode.children.push(childVirtualNode);
      updateList.push({
        type: "insert",
        newVirtualDOM: childVirtualNode
      });
    }
  }
  childMap.forEach((value) => {
    updateList.push({
      type: "delete",
      oldVirtualDOM: value
    });
  });
  share.deletePhase();
  return newVirtualNode;
}
function isStatic(element, hasStaticFather) {
  var _a;
  return typeof ((_a = element.props) == null ? void 0 : _a.static) === "boolean" ? element.props.static : hasStaticFather;
}
function initVirtualDOM(element, hasStaticFather = false) {
  debugger;
  const fatherStatic = isStatic(element, hasStaticFather);
  const genNode = (fatherVirtual, elementItem, hasStaticFather2 = false) => {
    const {component, props, children, ref} = elementItem;
    children.isChildren = true;
    const nodeStatic = isStatic(elementItem, hasStaticFather2);
    let virtualNode = {};
    share.setPhase({
      phase: PhaseEnum2.INIT,
      virtualDOM: virtualNode
    });
    if (typeof component === "function") {
      setContext({component, props});
      setObjectProps(virtualNode, {
        context: __assign2({}, getContext())
      });
      const {element: element2, instance} = getElement({
        elementType: component,
        props: __assign2(__assign2({}, props), {
          children
        }),
        fatherVirtualDOM: fatherVirtual
      });
      setObjectProps(virtualNode, __assign2(__assign2({
        key: null
      }, elementItem), {
        elementProps: __assign2(__assign2({}, props), {
          children
        }),
        father: fatherVirtual,
        children: [],
        instance,
        static: nodeStatic
      }));
      if (instance) {
        instance.componentWillMount();
      }
      const childVirtualNode = initVirtualDOM(element2, nodeStatic);
      deleteContext({component});
      childVirtualNode.father = virtualNode;
      virtualNode.children = [childVirtualNode];
      if (instance) {
        if (ref) {
          ref.current = instance;
        }
        instance.virtualNode = virtualNode;
        instance.forceUpdate = () => {
          updateClassComponent(instance);
        };
      }
    } else {
      setObjectProps(virtualNode, __assign2(__assign2({
        key: null
      }, elementItem), {
        father: fatherVirtual,
        children: [],
        static: nodeStatic,
        context: __assign2({}, getContext())
      }));
      virtualNode.children = elementItem.children.map((item) => genNode(virtualNode, item, nodeStatic));
    }
    share.deletePhase();
    return virtualNode;
  };
  return genNode(null, element, fatherStatic);
}
function isArrayEqual(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  let res = true;
  arr1.forEach((item1, index) => {
    const item2 = arr2[index];
    res && (res = Object.is(item1, item2));
  });
  return res;
}
function judgeHookName(actualName, name) {
  if (actualName !== name) {
    throw Error(`get hook ${actualName}, but need hook ${name}`);
  }
}
var initHooks = {
  useLXState: (initState) => {
    let state = null;
    if (typeof initState === "function") {
      state = initState();
    } else {
      state = initState;
    }
    const {virtualDOM} = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const hook = {
      name: HooksName.STATE,
      state,
      setState: null
    };
    const setState = (newState) => {
      hook.state = newState;
      updateFunctionComponent(nowVirtualDOM);
    };
    hook.setState = setState;
    if (!nowVirtualDOM.hooksList) {
      nowVirtualDOM.hooksList = [];
    }
    nowVirtualDOM.hooksList.push(hook);
    return [state, setState];
  },
  useLXEffect: (func, deps = []) => {
    const destroy = func();
    const {virtualDOM} = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const hook = {
      name: HooksName.EFFECT,
      func,
      deps,
      destroy: destroy || (() => {
      }),
      virtualDOM: null
    };
    if (!nowVirtualDOM.hooksList) {
      nowVirtualDOM.hooksList = [];
    }
    nowVirtualDOM.hooksList.push(hook);
  },
  useLXContext: (context) => {
    const {virtualDOM} = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const hook = {
      name: HooksName.CONTEXT,
      context
    };
    nowVirtualDOM.hooksList.push(hook);
    const id = getContextId(context);
    return nowVirtualDOM.context[id].value;
  }
};
var updateHooks = {
  useLXState: (_unused) => {
    const {virtualDOM, hooksIndex} = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const hook = nowVirtualDOM.hooksList[hooksIndex];
    judgeHookName(hook.name, HooksName.STATE);
    return [
      hook.state,
      hook.setState
    ];
  },
  useLXEffect: (func, deps = []) => {
    const {virtualDOM, hooksIndex} = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const oldHook = nowVirtualDOM.hooksList[hooksIndex];
    judgeHookName(oldHook.name, HooksName.EFFECT);
    const {deps: oldDeps} = oldHook;
    if (!isArrayEqual(oldDeps, deps)) {
      oldHook.destroy();
      const destroy = func();
      const hook = {
        name: HooksName.EFFECT,
        func,
        deps,
        destroy: destroy || (() => {
        }),
        virtualDOM: null
      };
      nowVirtualDOM.hooksList.splice(hooksIndex, 1, hook);
    }
  },
  useLXContext: (context) => {
    const {virtualDOM, hooksIndex} = share.getState();
    const nowVirtualDOM = virtualDOM[0];
    const hook = nowVirtualDOM.hooksList[hooksIndex];
    judgeHookName(hook.name, HooksName.CONTEXT);
    const id = getContextId(context);
    return nowVirtualDOM.context[id].value;
  }
};
function useHook(name) {
  return (...rest) => {
    const {phase} = share.getState();
    let res = null;
    if (phase[0] === PhaseEnum2.INIT) {
      res = initHooks[name].apply(null, rest);
    } else {
      res = updateHooks[name].apply(null, rest);
    }
    share.addHooksIndex();
    return res;
  };
}
var hooks = {
  useLXState: useHook("useLXState"),
  useLXEffect: useHook("useLXEffect"),
  useLXContext: useHook("useLXContext")
};
var {useLXState, useLXEffect, useLXContext} = hooks;
var LXReact_default = LXReact_exports;
