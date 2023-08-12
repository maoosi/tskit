import { isArray, isFunction, isObject } from './is'

/**
 * Create a new subset object by giving keys
 *
 * @category Object
 */
export function objectPick<O extends object, T extends keyof O>(obj: O, keys: T[], omitUndefined = false) {
    return keys.reduce((n, k) => {
        if (k in obj) {
            if (!omitUndefined || obj[k] !== undefined)
                n[k] = obj[k]
        }
        return n
    }, {} as Pick<O, T>)
}

/**
 * Clear undefined fields from an object. It mutates the object
 *
 * @category Object
 */
export function clearUndefined<T extends object>(obj: T): T {
    Object.keys(obj).forEach((key: string) => (obj[key] === undefined ? delete obj[key] : {}))
    return obj
}

/**
 * Deep clone
 *
 * @category Object
 */
export function clone<T extends object = object>(obj: T): DeepMerge<object, T> {
    return mergeWith({} as object, obj)
}

/**
 * Deep merge
 * 
 * Array and plain object properties are merged recursively.
 *
 * @category Object
 */
export function merge<T extends object = object>(...objects: T[]): DeepMerge<object, T> {
    return mergeWith({} as object, ...objects)
}

/**
 * Map key/value pairs for an object, and construct a new one
 *
 * @category Object
 */
export function mapValues<K extends string, V, NV = V>(
    obj: Record<K, V>,
    iteratee: keyof V | ((value: V) => NV | undefined)
): Record<K, V> {
    return Object.fromEntries(
        Object.entries(obj)
            .map(([k, v]) =>
                isFunction(iteratee)
                    ? [k, iteratee(v as V)]
                    : [k, (v as V)?.[iteratee]]
            )
    )
}

function mergeWith<T extends object = object, S extends object = T>(target: T, ...sources: S[]): DeepMerge<T, S> {
    if (!sources.length)
        return target as any

    const source = sources.shift()
    if (source === undefined)
        return target as any

    if (Array.isArray(target) && Array.isArray(source))
        target.push(...source)

    if (isMergableObject(target) && isMergableObject(source)) {
        objectKeys(source).forEach((key) => {
            if (key === '__proto__' || key === 'constructor' || key === 'prototype')
                return

            // @ts-expect-error
            if (Array.isArray(source[key])) {
                // @ts-expect-error
                if (!target[key])
                    // @ts-expect-error
                    target[key] = []

                // @ts-expect-error
                mergeWith(target[key], source[key])
            }
            // @ts-expect-error
            else if (isMergableObject(source[key])) {
                // @ts-expect-error
                if (!target[key])
                    // @ts-expect-error
                    target[key] = {}

                // @ts-expect-error
                mergeWith(target[key], source[key])
            }
            else {
                // @ts-expect-error
                target[key] = source[key]
            }
        })
    }

    return mergeWith(target, ...sources)
}

/**
 * Applies a mutation function to each key and value of an object recursively.
 * Ensures immutability of the original object by returning a new, deeply-copied and mutated object.
 * 
 * @param {Object} obj - Original object.
 * @param {Function} fn - Async mutator function, should return an object with potentially new key-value pair.
 * @return {Object} - A new mutated object.
 */
export async function walk(
    obj: any,
    fn: (arg: { key: string, value: any }, node: WalkNode) => Promise<{ key: string, value: any }>,
    node: WalkNode = new WalkNode()
): Promise<any> {
    const clonedObj = clone(obj);
    const out: any = {};
    const keys = Object.keys(clonedObj);

    for (const key of keys) {
        const newNode = new WalkNode([...node.path, key]);
        let { key: newKey, value: newValue } = await fn({ key, value: clonedObj[key] }, newNode);

        if (newValue && isObject(newValue) && !newNode.ignoreChildren) {
            newValue = await walk(newValue, fn, newNode);
        }

        else if (newValue && isArray(newValue) && !newNode.ignoreChildren) {
            for (let idx = 0; idx < newValue.length; idx++) {
                if (newValue[idx] && isObject(newValue[idx])) {
                    newValue[idx] = await walk(newValue[idx], fn, new WalkNode([...newNode.path, idx]))
                }
            }
        }

        out[newKey] = newValue;
    }

    return out;
}

class WalkNode {
    constructor(public path: (string | number)[] = [], public ignoreChildren: boolean = false) {
        this.path = path
        this.ignoreChildren = ignoreChildren
    }
    ignoreChilds() { this.ignoreChildren = true }
    getPath() { return this.path }
}

function objectKeys<T extends object>(obj: T) {
    return Object.keys(obj) as Array<`${keyof T & (string | number | boolean | null | undefined)}`>
}

function isMergableObject(item: any): item is Object {
    return isObject(item) && !Array.isArray(item)
}

type MergeInsertions<T> =
    T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T

type DeepMerge<F, S> = MergeInsertions<{
    [K in keyof F | keyof S]: K extends keyof S & keyof F
    ? DeepMerge<F[K], S[K]>
    : K extends keyof S
    ? S[K]
    : K extends keyof F
    ? F[K]
    : never;
}>