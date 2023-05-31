import { isFunction, isObject } from './is'
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
 * Creates a 
 *
 * @category Array
 */
export function orderBy<T>(array: readonly T[], keys: (keyof T)[], order?: ('asc' | 'desc')[]): T[] {
    let arr = copy(array)
    for (let i = keys.length - 1; i >= 0; i--) {
        arr.sort(sortBy<T>(keys[i], order?.[i] || 'asc'))
    }
    return arr
}

/**
 * Deep copy
 *
 * @category Array
 */
export function copy<T>(array: readonly T[]): T[] {
    return array.map(item => isObject(item) ? clone(item) : item) as T[]
}

/**
 * Get random item(s) from an array
 *
 * @param arr
 * @param quantity - quantity of random items which will be returned
 */
export function sample<T>(arr: T[], quantity?: number) {
    return Array.from({ length: quantity || 1 }, _ => arr[Math.round(Math.random() * (arr.length - 1))])
}

function sortBy<T>(key: keyof T, order: 'asc' | 'desc') {
    const gt = order === 'asc' ? 1 : -1
    const lt = order === 'asc' ? -1 : 1
    return (a: T, b: T) => (a[key] > b[key]) ? gt : ((b[key] > a[key]) ? lt : 0)
}
