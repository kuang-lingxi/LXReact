const { default: LXReact } = require('./index.cjs.js');

const jsxCode = jsxCode => {
  const { code } = require('esbuild').transformSync(jsxCode, {
    jsxFactory: 'LXReact.lxCreateElement',
    loader: 'jsx',
  });
  return eval(code);
};

test('self closing tag. eg: <div />', () => {
  expect(jsxCode(`<div />`)).toStrictEqual({ component: 'div', props: {}, children: [], name: 'div', key: null, ref: null, });
  expect(jsxCode(`<span />`)).toStrictEqual({ component: 'span', props: {}, children: [], name: 'span', key: null, ref: null, });
  expect(jsxCode(`<div data-props="hello"/>`)).toStrictEqual({
    component: 'div',
    props: { 'data-props': 'hello' },
    children: [],
    name: 'div',
    key: null,
    ref: null,
  });
});

test('include text tag. eg: <div>text</div>', () => {
  expect(jsxCode(`<div>text</div>`)).toStrictEqual({
    component: 'div',
    props: {},
    children: [{ component: 'text', children: [], props: { __value: 'text' }, name: 'text', key: null, ref: null, }],
    name: 'div',
    key: null,
    ref: null,
  });
});

test('include array. eg: <div>{[1, 2, 3].map(item => <div>{item}</div>)}</div>', () => {
  const obj = {
    component: 'div',
    props: {},
    children: [
      {
        component: 'div',
        props: {},
        children: [{ component: 'text', children: [], props: { __value: 1 }, name: 'text', key: null, ref: null, }],
        name: 'div',
        key: 0,
        ref: null,
      },
      {
        component: 'div',
        props: {},
        children: [{ component: 'text', children: [], props: { __value: 2 }, name: 'text', key: null, ref: null, }],
        name: 'div',
        key: 1,
        ref: null,
      },
      {
        component: 'div',
        props: {},
        children: [{ component: 'text', children: [], props: { __value: 3 }, name: 'text', key: null, ref: null, }],
        name: 'div',
        key: 2,
        ref: null,
      },
    ],
    name: 'div',
    key: 'custom',
    ref: null,
  };
  expect(jsxCode(`<div key="custom">{[1, 2, 3].map(item => <div>{item}</div>)}</div>`)).toStrictEqual(obj);
});
