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
var __export2 = (target, all) => {
  for (var name in all)
    __defProp2(target, name, {get: all[name], enumerable: true});
};
var LXReact_exports = {};
__export2(LXReact_exports, {
  Fragment: () => Fragment,
  LXComponent: () => LXComponent,
  LXPurComponent: () => LXPurComponent,
  createLXContext: () => createLXContext,
  lxCreateElement: () => lxCreateElement
});
var LXComponent = class {
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
LXComponent.isComponent = true;
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
var CustomComponent = {
  Fragment: "Fragment",
  Provider: "Provider",
  Consumer: "Consumer"
};
function lxCreateElement(elementType, props, ...children) {
  const formatChildren = (child = []) => {
    return child.map((item, index) => {
      if (typeof item === "string" || typeof item === "number") {
        return {
          component: "text",
          children: [],
          props: {__value: item},
          name: "text",
          key: null
        };
      }
      if (Array.isArray(item)) {
        item.forEach((itemChild, childIndex) => {
          itemChild.key = itemChild.key || `${index}-${childIndex}`;
        });
      }
      item.key = item.key || index;
      return item;
    });
  };
  const finalProps = props || {};
  const key = (finalProps == null ? void 0 : finalProps.key) || null;
  delete finalProps["key"];
  const element = {
    component: elementType,
    props: finalProps,
    children: formatChildren(children).flat(),
    name: typeof elementType === "function" ? elementType.name : elementType,
    key
  };
  return element;
}
var LXContextComponent = class extends LXComponent {
};
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
var LXReact_default = LXReact_exports;
