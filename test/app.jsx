import LXReact from 'lxreact';
import LXReactDOM from 'lx-react-dom';
import './index.less'
import { FunctionDemo } from './component/FunctionDemo';
import { ClassDemo } from './component/ClassDemo';
import { ClassDemo1 } from './component/ClassDemo1';
import { ShouldDemo } from './component/ShouldDemo';
import { StaticDemo } from './component/StaticDemo';
const { useLXState, useLXEffect } = LXReact;
const componentList = [
  {
    key: 'com1',
    component: ClassDemo,
  },
  {
    key: 'com2',
    component: ClassDemo1
  }
]

const Demo = () => {
  const [state, setState] = useLXState(0);

  useLXEffect(() => {
    setInterval(() => {
      console.log(state);
    }, 1000);
  }, [state])

  return (
    <>
      <div>{state}</div>
      <button onClick={() => setState(state+1)}>add</button>
    </>
  )
}

export class App extends LXReact.LXComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: 'App state',
      inputValue: 0
    }
  }
  render() {
    return (
      <div>
        <div>
          app state: {this.state.data}
        </div>

        <h1>function</h1>
        <Demo />

        <h1>基础 jsx 渲染</h1>
        <div>
          <div>div tag</div>
          <span>span tag</span>
          <div>
            <span>image</span>
            <img src="./static/images/image.jpg" alt="image" className="image"/>
          </div>
          <div>
            <span>input</span>
            <input type="text"/>
          </div>
        </div>

        <h1>受控表单</h1>
        <div>
          <input type="text" value={this.state.inputValue} onChange={e => this.setState({inputValue: e.target.value})}/>
        </div>

        <h1>组件渲染</h1>
        <div>
          <FunctionDemo msg="father data" static={true}>
            <div>Function Demo's child</div>
          </FunctionDemo>
        </div>
        <div>
          <ClassDemo />
        </div>

        <h1>key 的使用</h1>
        <div>
          <h2>顺序改变保持 state</h2>
          {componentList.sort(_ => Math.random() - Math.random()).map(item => {
            return <item.component key={item.key}/>
          })}

          <h2>顺序不变 key 变化销毁重新渲染</h2>
          {componentList.sort(_ => Math.random() - Math.random()).map(item => {
            return <item.component key={Math.random()}/>
          })}
        </div>

        <h1>props不变不重新渲染</h1>
        <div>
        <ClassDemo>
          <FunctionDemo msg="class demo's child">
            functionDemo child
          </FunctionDemo>
        </ClassDemo>
        </div>

        <h1>shouldComponentUpdate</h1>
        <div>
          <ShouldDemo data={this.state.data}/>
        </div>

        <h1>静态结点</h1>
        <StaticDemo msg={this.state.data} static={true}>
          <span static={false}>unStatic: Function Demo's child {this.state.data}</span>
        </StaticDemo>

        <button onClick={() => this.setState({data: Math.random()})}>app setState</button>
      </div>
    )
  }
}

LXReactDOM.render(App, document.getElementById('root'))