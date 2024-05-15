import { Align, OutlineRect, Side, Size } from 'shared/types/position';
import { safetyZone } from '../config/ui.json';

/** [Document](https://ui-prototype.jonnys.top/zh/utils/#setposition) */
export function setPosition(
  target: HTMLElement,
  size: Size,
  around: OutlineRect,
  align: Align = 'v-corner'
): Side {
  let side: Side = {
    v: 'bottom',
    h: 'right',
  };
  const SAFE_TOP = safetyZone[0];
  const SAFE_RIGHT = window.innerWidth - safetyZone[1];
  const SAFE_BOTTOM = window.innerHeight - safetyZone[2];
  const SAFE_LEFT = safetyZone[3];
  switch (align) {
    case 'corner':
      if (around.right + size.width <= SAFE_RIGHT) {
        target.style.left = around.right + 'px';
      } else {
        side.h = 'left';
        target.style.right =
          Math.max(size.width, SAFE_RIGHT - around.left) + 'px';
      }
      if (around.bottom + size.height <= SAFE_BOTTOM) {
        target.style.top = around.bottom + 'px';
      } else {
        side.v = 'top';
        target.style.bottom =
          Math.min(size.height, SAFE_BOTTOM - around.top) + 'px';
      }
      break;
    case 'h-corner':
      if (around.right + size.width <= SAFE_RIGHT) {
        target.style.left = around.right + 'px';
      } else {
        side.h = 'left';
        target.style.right =
          Math.max(size.width, SAFE_RIGHT - around.left) + 'px';
      }
      if (around.top + size.height <= SAFE_BOTTOM) {
        target.style.top = around.top + 'px';
      } else {
        side.v = 'top';
        target.style.bottom =
          Math.min(size.height, SAFE_BOTTOM - around.bottom) + 'px';
      }
      break;
    case 'v-corner':
      if (around.left + size.width <= SAFE_RIGHT) {
        target.style.left = around.left + 'px';
      } else {
        side.h = 'left';
        target.style.right =
          Math.min(size.width, SAFE_RIGHT - around.right) + 'px';
      }
      if (around.bottom + size.height <= SAFE_BOTTOM) {
        target.style.top = around.bottom + 'px';
      } else {
        side.v = 'top';
        target.style.bottom =
          Math.min(size.height, SAFE_BOTTOM - around.top) + 'px';
      }
      break;
    case 'h-center':
      if (around.right + size.width <= SAFE_RIGHT) {
        target.style.left = around.right + 'px';
      } else {
        side.h = 'left';
        target.style.right =
          Math.max(size.width, SAFE_RIGHT - around.left) + 'px';
      }
      target.style.top =
        Math.max(
          SAFE_TOP,
          Math.min(
            SAFE_BOTTOM - size.height,
            (around.bottom + around.top - size.height) / 2
          )
        ) + 'px';
      break;
    case 'v-center':
      target.style.left =
        Math.max(
          SAFE_LEFT,
          Math.min(
            SAFE_RIGHT - size.width,
            (around.right + around.left - size.width) / 2
          )
        ) + 'px';
      if (around.bottom + size.height <= SAFE_RIGHT) {
        target.style.top = around.bottom + 'px';
      } else {
        side.v = 'top';
        target.style.bottom =
          Math.min(size.height, SAFE_RIGHT - around.top) + 'px';
      }
      break;
  }
  return side;
}

/** [Document](https://ui-prototype.jonnys.top/zh/utils/#getscalefactor) */
export function getScaleFactor(w: number, h: number, increment: number) {
  let avg = (w + h) / 2;
  if (avg + increment < 0) return 0;
  return (avg + increment) / avg;
}
