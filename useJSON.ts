import { jsonrepair } from "jsonrepair";

export function stringifyJSON(
  jsonObject: any,
  opts?: { default?: string; throw?: boolean }
) {
  try {
    return JSON.stringify(jsonObject);
  } catch {
    const useThrow = typeof opts?.throw !== "undefined" ? opts.throw : false;

    if (useThrow) throw new Error(`JSON.stringify error on:\n${jsonObject}`);

    return opts?.default || "{}";
  }
}

export function parseJSON(
  jsonString: string,
  opts?: { default?: any; throw?: boolean }
) {
  try {
    return JSON.parse(jsonrepair(jsonString));
  } catch {
    const useThrow = typeof opts?.throw !== "undefined" ? opts.throw : false;

    if (useThrow) throw new Error(`JSON.parse error on:\n${jsonString}`);

    return opts?.default || {};
  }
}
