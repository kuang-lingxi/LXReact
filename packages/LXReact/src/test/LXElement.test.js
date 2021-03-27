const { default: LXReact } = require('./index.cjs');

const jsxCode = (jsxCode) => {
  const { code } = require('esbuild').transformSync(jsxCode, {
    jsxFactory: 'LXReact.lxCreateElement',
    loader: 'jsx',
  })

  return eval(code);
}

test('self closing tag. eg: <div />', () => {
  expect(jsxCode(`<div />`)).toStrictEqual({ component: 'div', props: {}, children: [] });
  expect(jsxCode(`<span />`)).toStrictEqual({ component: 'span', props: {}, children: [] });
  expect(jsxCode(`<div data-props="hello"/>`)).toStrictEqual({ component: 'div', props: {'data-props': 'hello'}, children: [] });
});

test('include text tag. eg: <div>text</div>', () => {
  expect(jsxCode(`<div>text</div>`)).toStrictEqual({
    component: 'div',
    props: {},
    children: [ { component: 'text', children: [], props: {__value: 'text'} } ]
  });
})