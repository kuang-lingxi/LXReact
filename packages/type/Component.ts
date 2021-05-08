import { LXComponent } from "../LXReact/src/LXBaseComponent";
import { LXContextComponentClass } from "../LXReact/src/LXContext";

class _ extends LXComponent {
  render(){}
}

export type LXReactComponentClass = typeof _;

export interface ComponentAttributeType {
  key?: string;
  style?: object;
}

export interface LXReactElementType {
  component: string | LXReactComponentClass | LXContextComponentClass | Function,
  props: {
    [key: string]: any,
    static?: boolean,
    __value?: string
  },
  children: LXReactElementType[],
  name: string;
  key: null | string;
}

export interface LXVirtualDOMTypeProps {
  [key: string]: any,
  __value?: string
}

export interface LXVirtualDOMType {
  component: string | LXReactComponentClass | Function,
  props: LXVirtualDOMTypeProps,
  oldProps?: LXVirtualDOMTypeProps,
  value?: string,
  children: LXVirtualDOMType[],
  father: LXVirtualDOMType,
  brother?: LXVirtualDOMType,
  realDOM?: HTMLElement,
  context?: Map<Symbol, {value: any}>;
  instance?: any,
  name: string,
  key: null | string;
  static: boolean;
}

export interface Update {
  type: 'insert' | 'update' | 'delete' | 'replace' | 'listUpdate',
  oldVirtualDOM?: LXVirtualDOMType,
  newVirtualDOM?: LXVirtualDOMType,
}

export const CustomComponent = {
  Fragment: 'Fragment',
  Provider: 'Provider',
  Consumer: 'Consumer'
}