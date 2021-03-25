import { LXComponent } from "../LXReact/src/LXBaseComponent";

export type LXReactComponentType =  typeof LXComponent;

export interface ComponentAttributeType {
  style?: object;
}

export interface LXReactElementType {
  type: string,
  props: object,
  children: LXReactElementType[],
  value?: string,
  instance?: any,
}

export interface LXVirtualDOMType {
  type: string,
  props: object,
  value?: string,
  children: LXVirtualDOMType[],
  father: LXVirtualDOMType,
  brother?: LXVirtualDOMType,
  realDOM?: HTMLElement
}