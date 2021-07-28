import LXReact from 'lxreact';
import { FunctionDemo } from './FunctionDemo';

export class ClassDemo extends LXReact.LXComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: 'class demo data'
    }
  }
  render() {
    return (
      <div style={{border: '1px solid black'}}>
        <div>class demo</div>
        <div>{this.state.data}</div>
        <button onClick={() => this.setState({data: Math.random()})} >class demo setState</button>
        {this.props.children}
        <FunctionDemo msg="test"/>
      </div>
    )
  }
}