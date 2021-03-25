import { ComponentAttributeType, LXReactComponentType, LXReactElementType } from '../../type/Component';

export function lxCreateElement(
  elementType: string | LXReactComponentType | Function,
  props: ComponentAttributeType,
  ...children
): LXReactElementType {
  if(typeof elementType === 'function') {
    const isComponent = (elementType as any)?.isComponent || false;

    if(isComponent) {
      const instance = new (elementType as any)({
        ...props,
        children,
      });
      const element = instance.render();
      element.instance = instance;
      return element;
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
