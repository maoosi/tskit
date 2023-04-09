export default function jsonParse(
  jsonString: string,
  opts?: { default?: any; throw?: boolean }
): any {
  try {
    return JSON.parse(jsonString);
  } catch {
    const useThrow = typeof opts?.throw !== "undefined" ? opts.throw : false;

    if (useThrow) throw new Error(`JSON.parse error on:\n${jsonString}`);

    return opts?.default || {};
  }
}
