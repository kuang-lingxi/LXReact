/* eslint-disable no-unused-vars */
import { LXVirtualDOMType } from "../../type/Component";
export abstract class LXComponent {
  static isComponent = true;
  public props;
  public state;
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

export class LXPurComponent extends LXComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {}
}

export class Fragment extends LXComponent {
  render() {}
}