import tryPromise from "./tryPromise";

export default async function tryPromiseAll<T>(
  promises: Promise<T>[],
  fallbacks?: any[]
): Promise<{ data: T; err: string | null }[]> {
  return await Promise.all(
    promises.map((promise, index) => tryPromise(promise, fallbacks?.[index]))
  );
}