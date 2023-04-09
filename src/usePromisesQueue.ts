export default function usePromisesQueue<T>(
  initialPromises: PromiseInQueue<T>[]
) {
  const promisesQueue: PromiseInQueue<T>[] = [...initialPromises];

  async function resolve(
    params: ExecutionParams<T>
  ): Promise<ResolveReturn<T>> {
    let resolved = 0;
    let succeeded = 0;
    let errored = 0;

    const results: T[] = [];
    const errors: Error[] = [];

    const {
      retries = 1,
      concurrent = 3,
      interval = 1000,
      timeout = 5000,
    } = params;

    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(() => resolve(true), ms));
    }

    async function resolveOrTimeout(promise: Promise<T>): Promise<T | Error> {
      let timer: any;

      return Promise.race([
        promise,
        new Promise(
          (_r, rej) =>
            (timer = setTimeout(rej, timeout, `Timeout after ${timeout}ms.`))
        ) as unknown as Promise<Error>,
      ]).finally(() => clearTimeout(timer));
    }

    async function resolvePromise(promise: PromiseInQueue<T>) {
      resolved++;

      let retryCount = 0;

      while (retryCount <= retries) {
        try {
          const result = await resolveOrTimeout(promise());
          results.push(result as T);
          succeeded++;
          break;
        } catch (error) {
          if (retryCount === retries) {
            errors.push(error as Error);
            errored++;
            break;
          }
          retryCount++;
          await delay(interval);
        }
      }
    }

    let currentConcurrent = 0;

    async function processPromises() {
      const runningPromises: Promise<void>[] = [];

      while (promisesQueue.length > resolved) {
        const promise = promisesQueue[resolved];

        if (currentConcurrent < concurrent) {
          currentConcurrent++;

          const runningPromise = resolvePromise(promise).then(() => {
            currentConcurrent--;
          });

          runningPromises.push(runningPromise);

          runningPromise.finally(async () => {
            const index = runningPromises.indexOf(runningPromise);

            if (index > -1) {
              await delay(interval);
              runningPromises.splice(index, 1);
            }
          });
        } else {
          await delay(100);
        }
      }

      await Promise.all(runningPromises);
    }

    await processPromises();

    return { results, errors };
  }

  return { resolve };
}

type ExecutionParams<T> = {
  concurrent?: number;
  retries?: number;
  interval?: number;
  timeout?: number;
};

type PromiseInQueue<T> = () => Promise<T>;

type ResolveReturn<T> = {
  results: T[];
  errors: Error[];
};
