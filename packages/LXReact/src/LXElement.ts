import { ComponentAttributeType, LXReactComponentType, LXReactElementType } from '../../type/Component';

export function lxCreateElement(
  elementType: string | LXReactComponentType | Function,
  props: ComponentAttributeType,
  ...children
): LXReactElementType {
  const formatChildren = (child = []) => {
    return child.map(item => {
      if(typeof item === 'string' || typeof item === 'number') {
        return {
          component: 'text',
          children: [],
          props: { __value: item }
        }
      }

      return item;
    })
  }

  const element = {
    component: elementType,
    props: props || {},
    children: formatChildren(children).flat(),
  };

  return element;
}
