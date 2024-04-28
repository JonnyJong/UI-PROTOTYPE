export type OutlineRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
export type Size = {
  width: number;
  height: number;
};
export type Side = {
  v: 'top' | 'bottom';
  h: 'left' | 'right';
};
export type Align =
  | 'corner'
  | 'h-corner'
  | 'v-corner'
  | 'h-center'
  | 'v-center';
