import { LXComponent } from "../LXReact/src/LXBaseComponent";

export type LXReactComponentType =  typeof LXComponent;

export interface ComponentAttributeType {
  style?: object;
}

export interface LXReactElementType {
  component: string | LXReactComponentType | Function,
  props: {
    [key: string]: any,
    __value?: string
  },
  children: LXReactElementType[],
}

export interface LXVirtualDOMType {
  component: string | LXReactComponentType | Function,
  props: {
    [key: string]: any,
    __value?: string
  },
  value?: string,
  children: LXVirtualDOMType[],
  father: LXVirtualDOMType,
  brother?: LXVirtualDOMType,
  realDOM?: HTMLElement,
  instance?: any,
  name: string,
}