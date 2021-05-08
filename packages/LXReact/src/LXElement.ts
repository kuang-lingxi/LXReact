import { ComponentAttributeType, LXReactComponentClass, LXReactElementType } from '../../type/Component';
import { LXContextComponentClass } from './LXContext';

export function lxCreateElement(
  elementType: string | LXReactComponentClass | LXContextComponentClass | Function,
  props: ComponentAttributeType,
  ...children
): LXReactElementType {
  const formatChildren = (child = []) => {
    return child.map((item, index) => {

      if(typeof item === 'string' || typeof item === 'number') {
        return {
          component: 'text',
          children: [],
          props: { __value: item },
          name: 'text',
          key: null
        }
      }

      if(Array.isArray(item)) {
        item.forEach((itemChild, childIndex) => {
          itemChild.key = itemChild.key || `${index}-${childIndex}`;
        })
      }

      item.key = item.key || index;

      return item;
    })
  }

  const finalProps = props || {};
  const key = finalProps?.key || null;
  delete finalProps['key']

  const element = {
    component: elementType,
    props: finalProps,
    children: formatChildren(children).flat(),
    name: typeof elementType === 'function' ? elementType.name : elementType,
    key
  };
  return element;
}
