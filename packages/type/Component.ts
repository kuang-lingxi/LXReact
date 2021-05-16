/* eslint-disable no-unused-vars */
export enum PhaseEnum {
  INIT = 'init',
  UPDATE = 'update',
  COMMIT = 'commit',
  FREE = 'free',
}

export const HooksName = {
  STATE: 'state',
  EFFECT: 'effect',
  CONTEXT: 'context',
}

export abstract class LXComponentAbstract {
  static isComponent = true;
  static contextType;
  public props;
  public state;
  public context;
  public virtualNode: LXVirtualDOMType;
  constructor(props) {
    this.props = props;
    this.setState.bind(this);
  }
  forceUpdate() {
    
  }
  setState(state) {
    this.state = {
      ...this.state,
      ...state
    };
    this.forceUpdate();
  }

  // 挂载生命周期
  componentWillMount() {}
  componentDidMount() {}

  // 更新生命周期
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  abstract render(): any;
  componentWillUpdate() {}
  componentDidUpdate() {}

  //卸载
  // componentWillUnmount() {}

}
class _Component extends LXComponentAbstract {
  render(){}
}

export type LXComponentClass = typeof _Component;

export abstract class LXContextComponent extends LXComponentAbstract {
  static contextId: Symbol;
}

class _Context extends LXContextComponent {
  render(){}
}

export type LXContextComponentClass = typeof _Context;


export type StateHook = {
  name: string;
  state: any;
  setState: Function;
}

export type EffectHook = {
  name: string;
  func: () => Function | void;
  deps: any[];
  destroy: Function;
}

export type ContextHook = {
  name: string;
  context: object;
}

export type HooksListType = (StateHook | EffectHook | ContextHook)[];

export interface ComponentAttributeType {
  key?: string;
  style?: object;
  ref?: { current: any };
}

export interface LXReactElementType {
  component: string | LXComponentClass | LXContextComponentClass | Function,
  props: {
    [key: string]: any,
    static?: boolean,
    __value?: string
  },
  children: LXReactElementType[],
  name: string;
  key: null | string;
  ref: null | { current: any };
}

export interface LXVirtualDOMTypeProps {
  [key: string]: any,
  __value?: string
}

export interface LXVirtualDOMType {
  component: string | LXComponentClass | Function,
  props: LXVirtualDOMTypeProps,
  oldProps?: LXVirtualDOMTypeProps,
  elementProps?: {
    children: any[],
    [key: string]: any
  }
  value?: string,
  children: LXVirtualDOMType[],
  father: LXVirtualDOMType,
  brother?: LXVirtualDOMType,
  realDOM?: HTMLElement,
  context?: object;
  instance?: any,
  name: string,
  key: null | string;
  ref: null | {current: any};
  static: boolean;
  hooksList?: HooksListType;
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