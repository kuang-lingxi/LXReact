import LXReact from 'lxreact';

export class ShouldDemo extends LXReact.LXComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: 'ShouldDemo data false'
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div style={{border: '1px solid black'}}>
        <div>ShouldDemo</div>
        <div>{this.state.data}</div>
        <div>{this.props.data}</div>
        <button onClick={() => this.setState({data: Math.random()})} >class demo setState</button>
      </div>
    )
  }
}