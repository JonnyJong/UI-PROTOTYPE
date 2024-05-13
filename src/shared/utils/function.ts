import { OperationSequence } from 'shared/types/function';
import { sleep } from './timer';

export function run<T = any, Args extends Array<any> = any[]>(
  fn: any,
  ...args: Args
): Promise<T | Error> {
  return new Promise((resolve) => {
    try {
      resolve(fn(...args));
    } catch (error) {
      if (!(error instanceof Error)) {
        error = new Error('Failed attempt to execute function', {
          cause: error,
        });
      }
      resolve(error as Error);
    }
  });
}

export async function runSequence(
  sequence: OperationSequence,
  ignoreError = false
) {
  for (const op of sequence) {
    if (typeof op === 'number') {
      await sleep(op);
      continue;
    }
    let result = await run(op);
    if (result instanceof Error) {
      if (ignoreError) {
        console.warn(result);
        continue;
      }
      throw result;
    }
    if (typeof result === 'number') await sleep(result);
  }
}
