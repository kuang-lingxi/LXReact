import { LXReactComponentType, LXReactElementType } from "../../type/Component";

let globalElement = null;

let globalInstance = null;

function createTextNode(text: string) {
  return document.createTextNode(text);
}

function createDOM(type: string) {
  return document.createElement(type)
}

function setAttribute(dom, props) {
  Object.keys(props).forEach((key) => {
    switch (key) {
      case 'style':
        Object.keys(props[key]).forEach((styleKey) => {
          dom.style[styleKey] = props[key][styleKey];
        });
        break;
      case 'onClick':
        dom.addEventListener('click', (e) => {
          props[key](e);
        });
        break;
    }
  });
}

function renderElement(element: LXReactElementType, fatherDOM: HTMLElement) {
  const fragment = document.createDocumentFragment();
  const { type, props, children } = element;
  if(type === 'text') {
    fragment.appendChild(createTextNode(element.value));
  }else {
    const dom = createDOM(type);
    setAttribute(dom, props);
    children.forEach(elementItem => renderElement(elementItem, dom));
    fragment.appendChild(dom);
  }
  
  fatherDOM.appendChild(fragment)
}


export function render(Component: LXReactComponentType, root: HTMLElement) {
  if (Component.isComponent) {
    globalInstance = new (Component as any)();
    globalElement = globalInstance.render();
  } else {
    globalElement = (Component as any)();
  }
  renderElement(globalElement, root);
}
