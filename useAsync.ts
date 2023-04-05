export async function useAsync<T>(promise: Promise<T>, fallback?: any) {
  try {
    const data = await promise;
    return { data, err: null } as const;
  } catch (err) {
    const data = typeof fallback !== "undefined" ? fallback : null;
    return { data, err } as const;
  }
}

export async function useAsyncAll<T>(
  promises: Promise<T>[],
  fallbacks?: any[]
) {
  return await Promise.all(
    promises.map((promise, index) => useAsync(promise, fallbacks?.[index]))
  );
}
