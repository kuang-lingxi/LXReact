import { ComponentAttributeType } from '../../type/Component';
import { LXComponent } from './LXBaseComponent';

export function lxCreateElement(
  elementType: string | (typeof LXComponent) | Function,
  props: ComponentAttributeType = {},
  ...children
) {
  if(typeof elementType === 'function') {
    const isComponent = (elementType as any)?.isComponent || false;

    if(isComponent) {
      const instance = new (elementType as any)(props);
      return instance.render();
    }

    return (elementType as Function)(props);
  }

  const element = {
    type: elementType,
    config: props || {},
    children: [ ...children ].flat(),
  };

  return element;
}
