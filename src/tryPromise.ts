export default async function tryPromise<T>(
  promise: Promise<T>,
  fallback?: any
): Promise<{ data: T; err: string | null }> {
  try {
    const data = await promise;
    return { data, err: null } as const;
  } catch (err) {
    const data = typeof fallback !== "undefined" ? fallback : null;
    return { data, err } as const;
  }
}
