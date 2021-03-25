export interface LXReactComponentType {
  isComponent: boolean;
  render: () => any;
}

export interface ComponentAttributeType {
  style?: object;
}

export interface LXReactElementType {
  type: string,
  props: object,
  children: LXReactElementType[],
  value?: string,
}