/**
 * Promised `setTimeout`
 *
 * @category Promise
 */
export function sleep(ms: number, callback?: Fn<any>) {
    return new Promise<void>(resolve =>

        setTimeout(async () => {
            await callback?.()
            resolve()
        }, ms),
    )
}

/**
 * Resolve promise
 *
 * @category Promise
 */
export async function resolve<T>(
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

/**
 * Resolve all promises
 *
 * @category Promise
 */
export async function resolveAll<T>(
    promises: Promise<T>[],
    fallbacks?: any[],
    opts?: { timeout?: number }
): Promise<{ data: T; err: string | null }[]> {
    return await Promise.all(
        promises.map((promise, index) => resolve(promise, fallbacks?.[index], opts))
    );
}

/**
 * Promises queue
 *
 * @category Promise
 */
export function resolveQueue<T extends any>(
    initialPromises: PromiseInQueue<T>[],
) {
    const promisesQueue: PromiseInQueue<T>[] = [...initialPromises]

    async function resolve(
        params?: ExecutionParams<T>,
    ): Promise<ResolveReturn<T>> {
        let resolved = 0
        let succeeded = 0
        let errored = 0
        const results: T[] = []
        const errors: Error[] = []
        const {
            retries = 0,
            concurrent = 3,
            interval = 1000,
            timeout = 5000,
        } = params || {}

        async function resolvePromise(promise: PromiseInQueue<T>) {
            resolved++
            let retryCount = 0
            while (retryCount <= retries) {
                try {
                    const result = await resolveOrTimeout(promise(), timeout, true)
                    results.push(result as T)
                    succeeded++
                    break
                }
                catch (error) {
                    if (retryCount === retries) {
                        errors.push(error as Error)
                        errored++
                        break
                    }
                    retryCount++
                    await sleep(interval)
                }
            }
        }

        let currentConcurrent = 0

        async function processPromises() {
            const runningPromises: Promise<void>[] = []
            while (promisesQueue.length > resolved) {
                const promise = promisesQueue[resolved]
                if (currentConcurrent < concurrent) {
                    currentConcurrent++
                    const runningPromise = resolvePromise(promise).then(() => {
                        currentConcurrent--
                    })
                    runningPromises.push(runningPromise)
                    runningPromise.finally(async () => {
                        const index = runningPromises.indexOf(runningPromise)
                        if (index > -1) {
                            await sleep(interval)
                            runningPromises.splice(index, 1)
                        }
                    })
                }
                else {
                    await sleep(100)
                }
            }
            await Promise.all(runningPromises)
        }

        await processPromises()

        return { results, errors: errors.length > 0 ? errors : null }
    }

    return { resolve }
}

async function resolveOrTimeout<T>(promise: Promise<T>, timeout: number, reject?: boolean): Promise<T> {
    let timer: any
    return Promise.race([
        promise,
        new Promise((res, rej) =>
            reject
                ? (timer = setTimeout(rej, timeout, `Timeout after ${timeout}ms.`))
                : (timer = setTimeout(() => res(({ timeout: true })), timeout))
        ) as unknown as Promise<T>,
    ]).finally(() => clearTimeout(timer))
}

type ExecutionParams<T> = {
    concurrent?: number
    retries?: number
    interval?: number
    timeout?: number
}

type PromiseInQueue<T> = () => Promise<T>

type ResolveReturn<T> = {
    results: T[]
    errors: Error[] | null
}

type Fn<T = void> = () => T
