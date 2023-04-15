export default function jsonStringify(
  jsonObject: any,
  opts?: { default?: string; throw?: boolean; pretty?: boolean },
): string {
  try {
    const prettify = typeof opts?.pretty !== 'undefined' ? opts.pretty : false
    return prettify ? JSON.stringify(jsonObject, null, 2) : JSON.stringify(jsonObject)
  }
  catch {
    const useThrow = typeof opts?.throw !== 'undefined' ? opts.throw : false

    if (useThrow)
      throw new Error(`JSON.stringify error on:\n${jsonObject}`)

    return opts?.default || '{}'
  }
}
