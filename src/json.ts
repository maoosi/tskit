import { isArray, isObject, isError } from "./is";

/**
 * JSON.parse
 *
 * @category Json
 */
export function parse<T extends string | undefined, U extends any = undefined>(
    str: T,
    undefinedVal?: U
): Parse<U> {
    try {
        return JSON.parse(str as string) as Parse<U>
    } catch {
        if (isError(undefinedVal)) throw undefinedVal;
        return undefinedVal as Parse<U>
    }
}

/**
 * JSON.stringify
 *
 * @category Json
 */
export function stringify<T extends object | undefined, U extends any = undefined>(
    json: T,
    undefinedVal?: U,
    pretty?: boolean
): Stringify<U> {
    try {
        if (!isObject(json) && !isArray(json)) throw new Error()
        return JSON.stringify(json, null, pretty ? 2 : undefined) as Stringify<U>
    }
    catch {
        if (isError(undefinedVal)) throw undefinedVal;
        return undefinedVal as Stringify<U>
    }
}

type Stringify<U> = U extends undefined ? string | undefined : string | U;
type Parse<U> = U extends undefined ? object | any[] | undefined : object | any[] | U;
