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
  LXComponent: () => LXComponent,
  LXPurComponent: () => LXPurComponent,
  lxCreateElement: () => lxCreateElement
});
function lxCreateElement(elementType, props, ...children) {
  const formatChildren = (child = []) => {
    return child.map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return {
          component: "text",
          children: [],
          props: {__value: item}
        };
      }
      return item;
    });
  };
  const element = {
    component: elementType,
    props: props || {},
    children: formatChildren(children).flat()
  };
  return element;
}
var LXComponent = class {
  constructor(props) {
    this.props = props;
  }
  forceUpdate() {
  }
  setState(state) {
    this.state = __assign(__assign({}, this.state), state);
    this.forceUpdate();
  }
};
LXComponent.isComponent = true;
var LXPurComponent = class extends LXComponent {
  shouldComponentUpdate(nextProps, nextState) {
  }
  render() {
  }
};
var LXReact_default = LXReact_exports;
