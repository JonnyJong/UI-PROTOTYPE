export function range(from: number, to: number, step: number = 1): number[] {
  let result: number[] = [];
  for (let i = from; i < to; i += step) {
    result.push(i);
  }
  return result;
}
