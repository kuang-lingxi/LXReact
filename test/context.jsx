import LXReact from 'lxreact';
import LXReactDOM from 'lx-react-dom';

const Context = LXReact.createLXContext();

class Context1 extends LXReact.LXComponent {
  static contextType = Context;

  render() {
    console.log("this.context1", this.context);
    return (
      <div>
        <div>context1 value is {this.context.data}</div>
        <Context.Provider value={{data: 'other init data'}}>
          <Context2 />
        </Context.Provider>
      </div>
    )
  }
}

class Context2 extends LXReact.LXComponent {
  static contextType = Context;
  render() {
    console.log("this.context2", this.context);
    return (
      <div>
        <div>context2 value is {this.context.data}</div>
      </div>
    )
  }
}

class App extends LXReact.LXComponent {
  state = {
    data: 'init data'
  }
  render() {
    return (
      <div>
        <Context.Provider value={this.state}>
          <Context1 />
          <button onClick={() => this.setState({data: Math.random()})}>setState</button>
          {[1, 2, 3].map(item => {
            return <div>{item}</div>
          })}
        </Context.Provider>
      </div>
    )
  }
}

export default App;

LXReactDOM.render(App, document.getElementById('root'))