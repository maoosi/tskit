export default async function tryPromise<T>(
  promise: Promise<T>,
  fallback?: any,
  opts?: { timeout?: number }
): Promise<{ data: T; err: string | null }> {
  try {
    const data = opts?.timeout
      ? await resolveOrTimeout<T>(promise, opts.timeout)
      : await promise

    if ((data as any)?.timeout)
      throw new Error(`Timeout after ${opts?.timeout}ms.`)

    return { data, err: null };
  } catch (err: any) {
    const data = typeof fallback !== "undefined" ? fallback : null;

    return { data, err };
  }
}

async function resolveOrTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  let timer: any

  return Promise.race([
    promise,
    new Promise((res) => (timer = setTimeout(() => res(({ timeout: true })), timeout))) as unknown as Promise<T>,
  ]).finally(() => clearTimeout(timer))
}
