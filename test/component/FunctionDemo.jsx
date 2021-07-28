import LXReact from 'lxreact';

export const FunctionDemo = (props) => {
  console.log("Function Demo render");
  return (
    <div style={{border: '1px solid black'}}>
      <div>Function Demo</div>
      <div>props: {props.msg}</div>
      {props.children}
    </div>
  )
}