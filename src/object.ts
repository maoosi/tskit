import { isArray, isObject, isFunction } from './is'
import { notNullish } from './guards'

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
 * Traverse Oject Nodes
 *
 * @category Object
 */
export async function traverse(
    node: any,
    callback: (node: Traverse) => Promise<void>,
    parentKey?: string | number,
    key?: string | number,
    path: (string | number)[] = []
): Promise<any> {
    if (isArray(node)) {
        let newArray: any[] = [...node]
        let shouldContinue = true
        const setFn = (newVal: any) => newArray = newVal
        const breakFn = () => shouldContinue = false
        const traverseNode: Traverse = {
            parentKey,
            childKeys: Array.from(Array(newArray.length).keys()),
            key,
            value: newArray,
            type: 'array',
            path: typeof key !== 'undefined' ? [...path, key] : [...path],
            set: setFn,
            break: breakFn,
        }
        await callback(traverseNode)
        if (shouldContinue) {
            for (let childKey = 0; childKey < node.length; childKey++) {
                const childValue = node[childKey]
                newArray[childKey] = await traverse(
                    childValue,
                    callback,
                    key,
                    childKey,
                    typeof key !== 'undefined'
                        ? [...path, key] : [...path],
                )
            }
        }
        return newArray
    }
    else if (isObject(node)) {
        let newObject: any = { ...node }
        let shouldContinue = true
        const setFn = (newVal: any) => newObject = newVal
        const breakFn = () => shouldContinue = false
        const traverseNode: Traverse = {
            parentKey,
            childKeys: Object.keys(newObject),
            key,
            value: newObject,
            type: 'object',
            path: typeof key !== 'undefined'
                ? [...path, key] : [...path],
            set: setFn,
            break: breakFn,
        }
        await callback(traverseNode)
        if (shouldContinue) {
            for (const [childKey, childValue] of Object.entries(newObject)) {
                newObject[childKey] = await traverse(
                    childValue,
                    callback,
                    key,
                    childKey,
                    typeof key !== 'undefined'
                        ? [...path, key] : [...path],
                )
            }
        }
        return newObject
    }
    else {
        let newValue = node
        const setFn = (newVal: any) => newValue = newVal
        const breakFn = () => { }
        const traverseNode: Traverse = {
            parentKey,
            childKeys: [],
            key,
            value: newValue,
            type: 'value',
            path: typeof key !== 'undefined'
                ? [...path, key] : [...path],
            set: setFn,
            break: breakFn,
        }
        await callback(traverseNode)
        return newValue
    }
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

type Traverse = {
    parentKey?: string | number;
    childKeys?: (string | number)[];
    key?: string | number;
    value: any;
    type: "array" | "object" | "value";
    path: (string | number)[];
    set: (newValue: any) => void;
    break: () => void;
}