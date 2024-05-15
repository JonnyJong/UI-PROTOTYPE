/** [Document](https://ui-prototype.jonnys.top/zh/utils/#range) */
export function range(from: number, to: number, step: number = 1): number[] {
  let result: number[] = [];
  for (let i = from; i < to; i += step) {
    result.push(i);
  }
  return result;
}

/** [Document](https://ui-prototype.jonnys.top/zh/utils/#clamp) */
export function clamp(min: number, value: number, max: number): number {
  if (min > max) [min, max] = [max, min];
  return Math.max(min, Math.min(value, max));
}
