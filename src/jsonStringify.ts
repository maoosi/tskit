export default function jsonStringify(
  jsonObject: any,
  opts?: { default?: string; throw?: boolean }
): string {
  try {
    return JSON.stringify(jsonObject);
  } catch {
    const useThrow = typeof opts?.throw !== "undefined" ? opts.throw : false;

    if (useThrow) throw new Error(`JSON.stringify error on:\n${jsonObject}`);

    return opts?.default || "{}";
  }
}
