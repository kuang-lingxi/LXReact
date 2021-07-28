import LXReact from 'lxreact';

export class ClassDemo1 extends LXReact.LXComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: 'class demo data'
    }
  }
  render() {
    return (
      <div style={{border: '1px solid black'}}>
        <div>class demo1</div>
        <div>{this.state.data}</div>
        <button onClick={() => this.setState({data: Math.random()})} >class demo setState</button>
      </div>
    )
  }
}