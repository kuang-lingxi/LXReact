import { LXVirtualDOMType } from "../../type/Component";

export abstract class LXComponent {
  static isComponent = true;
  public props;
  public state;
  public virtualNode: LXVirtualDOMType;
  constructor(props) {
    this.props = props;
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
  abstract render(): any;
}

export class LXPurComponent extends LXComponent {
  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps, nextState) {
    
  }

  render() {}
}