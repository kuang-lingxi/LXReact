import { ComponentAttributeType, LXReactElementType } from '../../type/Component';
import { LXComponent } from './LXBaseComponent';

export function lxCreateElement(
  elementType: string | (typeof LXComponent) | Function,
  props: ComponentAttributeType,
  ...children
): LXReactElementType {
  if(typeof elementType === 'function') {
    const isComponent = (elementType as any)?.isComponent || false;

    if(isComponent) {
      const instance = new (elementType as any)(props);
      return instance.render();
    }

    return (elementType as Function)(props);
  }

  const formatChildren = (child) => {
    return child.map(item => {
      if(typeof item === 'string' || typeof item === 'number') {
        return {
          type: 'text',
          value: item,
          children: [],
          props: {}
        }
      }

      return item;
    })
  }

  const element = {
    type: elementType,
    props: props || {},
    children: formatChildren(children).flat(),
  };

  return element;
}
