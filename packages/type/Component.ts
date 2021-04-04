import { LXComponent } from "../LXReact/src/LXBaseComponent";

export type LXReactComponentType =  typeof LXComponent;

export interface ComponentAttributeType {
  key?: string;
  style?: object;
}

export interface LXReactElementType {
  component: string | LXReactComponentType | Function,
  props: {
    [key: string]: any,
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
  component: string | LXReactComponentType | Function,
  props: LXVirtualDOMTypeProps,
  oldProps?: LXVirtualDOMTypeProps,
  value?: string,
  children: LXVirtualDOMType[],
  father: LXVirtualDOMType,
  brother?: LXVirtualDOMType,
  realDOM?: HTMLElement,
  instance?: any,
  name: string,
  key: null | string;
}

export interface Update {
  type: 'insert' | 'update' | 'delete' | 'replace' | 'listUpdate',
  oldVirtualDOM?: LXVirtualDOMType,
  newVirtualDOM?: LXVirtualDOMType,
}