import LXReact from 'lxreact';

export const StaticDemo = (props) => {
  console.log("Function Demo render");
  return (
    <div style={{border: '1px solid black'}}>
      <div>static Demo</div>
      <div static={false}>unStatic Props: {props.msg}</div>
      <div>static Props: {props.msg}</div>
      {props.children}
    </div>
  )
}