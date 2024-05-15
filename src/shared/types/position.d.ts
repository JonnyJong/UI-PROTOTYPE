/** [Document](https://ui-prototype.jonnys.top/zh/utils/#size) */
export type Size = {
  width: number;
  height: number;
};

/** [Document](https://ui-prototype.jonnys.top/zh/utils/#outlinerect) */
export type OutlineRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/** [Document](https://ui-prototype.jonnys.top/zh/utils/#align) */
export type Align =
  | 'corner'
  | 'h-corner'
  | 'v-corner'
  | 'h-center'
  | 'v-center';

/** [Document](https://ui-prototype.jonnys.top/zh/utils/#side) */
export type Side = {
  v: 'top' | 'bottom';
  h: 'left' | 'right';
};
