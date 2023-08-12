import { isFunction, isObject } from './is';
import { clone } from './object';

/**
 * Creates an array of shuffled values
 *
 * @category Array
 */
export function shuffle<T>(array: readonly T[]): T[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

/**
 * Creates a duplicate-free version of an array
 *
 * @category Array
 */
export function uniq<T>(array: readonly T[]): T[] {
    return Array.from(new Set(array))
}

/**
 * Creates a duplicate-free version of an array using iteratee
 *
 * @category Array
 */
export function uniqBy<T>(array: readonly T[], iteratee: keyof T | ((a: any) => any)): T[] {
    return array.reduce((acc: T[], cur: any) => {
        const computed = isFunction(iteratee)
        const index = acc.findIndex((item: any) =>
            computed
                ? iteratee(item) === iteratee(cur)
                : typeof cur?.[iteratee] !== 'undefined' && item?.[iteratee] === cur?.[iteratee]
        )
        if (index === -1)
            acc.push(cur)
        return acc
    }, [])
}

/**
 * Return a copy ordered by iteratee
 *
 * @category Array
 */
export function orderBy<T>(
    array: readonly T[],
    iteratee: ((keyof T) | ((a: T) => any)) | ((keyof T) | ((a: T) => any))[],
    order?: ('asc' | 'desc') | ('asc' | 'desc')[]
): T[] {
    let arr = copy(array)
    const iterateeArr = Array.isArray(iteratee) ? iteratee : [iteratee]
    const orderArr = Array.isArray(order) ? order : [order]
    for (let i = iterateeArr.length - 1; i >= 0; i--) {
        arr.sort(sortBy<T>(iterateeArr[i], orderArr?.[i] || 'asc'))
    }
    return arr
}

function sortBy<T>(key: keyof T | ((a: T) => any), order: 'asc' | 'desc') {
    const gt = order === 'asc' ? 1 : -1
    const lt = order === 'asc' ? -1 : 1
    const fn = isFunction(key)
    return (a: T, b: T) => {
        const l = fn ? key(a) : a[key]
        const r = fn ? key(b) : b[key]
        return (l > r) ? gt : ((r > l) ? lt : 0)
    }
}

/**
 * Deep copy
 *
 * @category Array
 */
export function copy<T>(array: readonly T[]): T[] {
    return (array?.map(item => isObject(item) ? clone(item) : item) || []) as T[]
}

/**
 * Get random item(s) from an array
 *
 * @param arr
 * @param quantity - quantity of random items which will be returned
 * 
 * @category Array
 */
export function sample<T>(arr: T[], quantity?: number) {
    return Array.from({ length: quantity || 1 }, _ => arr[Math.round(Math.random() * (arr.length - 1))])
}
