let globalElement = null;

let globalInstance = null;

let globalRoot = null;

function setAttribute(dom, config) {
  Object.keys(config).forEach((key) => {
    switch (key) {
      case 'style':
        Object.keys(config[key]).forEach((styleKey) => {
          dom.style[styleKey] = config[key][styleKey];
        });
        break;
      case 'onClick':
        dom.addEventListener('click', (e) => {
          config[key](e);
        });
        break;
    }
  });
}

function renderChild(elementArr, root) {
  const fragment = document.createDocumentFragment();
  elementArr.forEach((item) => {
    if (Object.prototype.toString.call(item) !== '[object Object]') {
      const dom = document.createTextNode(String(item));
      fragment.appendChild(dom);
      return;
    }
    const { type, config, children = [] } = item;
    const dom = document.createElement(type);
    setAttribute(dom, config);
    renderChild(children, dom);
    fragment.appendChild(dom);
  });

  root.appendChild(fragment);
}

function forceUpdate() {
  globalElement = globalInstance.render();
  const { config = {}, children = [], type } = globalElement;
  const dom = document.createElement(type);
  setAttribute(dom, config);
  renderChild(children, dom);
  globalRoot.innerHTML = null;
  globalRoot.appendChild(dom);
}

function render(Component, root) {
  globalInstance = new Component();
  globalElement = globalInstance.render();
  globalRoot = root;
  forceUpdate();
}

export default {
  render,
  forceUpdate,
};
