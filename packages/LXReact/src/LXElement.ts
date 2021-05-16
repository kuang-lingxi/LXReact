import { ComponentAttributeType, LXComponentClass, LXContextComponentClass, LXReactElementType } from '../../type/Component';

export function lxCreateElement(
  elementType: string | LXComponentClass | LXContextComponentClass | Function,
  props: ComponentAttributeType,
  ...children
): LXReactElementType {
  const formatChildren = (child = []) => {
    return child.map((item) => {

      if(typeof item === 'string' || typeof item === 'number') {
        return {
          component: 'text',
          children: [],
          props: { __value: item },
          name: 'text',
          key: null,
          ref: null,
        }
      }
      if(Array.isArray(item) && !(item as any)?.isChildren) {
        item.forEach((itemChild, index) => {
          itemChild.key = ('key' in itemChild && itemChild.key !== null) ? itemChild.key : index;
        })
      }

      return item;
    })
  }
  const finalProps = props || {};
  const key = ('key' in finalProps) ? finalProps.key : null;
  const ref = ('ref' in finalProps ) ? finalProps.ref : null;
  const finalChildren = formatChildren([ ...children ]).flat();
  (finalChildren as any).isChildren = true;
  delete finalProps['key'];
  const element = {
    component: elementType,
    props: finalProps,
    children: finalChildren,
    name: typeof elementType === 'function' ? elementType.name : elementType,
    key,
    ref,
  };
  return element;
}
