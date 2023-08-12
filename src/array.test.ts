import { describe, test, expect } from 'vitest'
import { orderBy, shuffle, uniq, uniqBy } from './array'

describe('array', () => {
    test('shuffle', () => {
        const arr1 = [1, 2, 3, 4]
        expect(shuffle(arr1)).toEqual(expect.arrayContaining([4, 1, 3, 2]))
    })

    test('uniq', () => {
        expect(uniq([2, 1, 2])).toStrictEqual([2, 1])
    })

    test('uniqBy', () => {
        expect(uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x')).toStrictEqual([{ 'x': 1 }, { 'x': 2 }])
        expect(uniqBy([2.1, 1.2, 2.3], Math.floor)).toStrictEqual([2.1, 1.2])
        expect(uniqBy([{ 'y': undefined }, { 'y': null }, { 'y': 0 }, { 'y': '' }], 'y')).toStrictEqual(
            [{ 'y': undefined }, { 'y': null }, { 'y': 0 }, { 'y': '' }]
        )
    })

    test('orderBy', () => {
        const users = [
            { 'user': 'fred', 'age': 48 },
            { 'user': 'barney1', 'age': 34 },
            { 'user': 'fred', 'age': 40 },
            { 'user': 'barney2', 'age': 34 }
        ]
        expect(orderBy(users, ['user', 'age'], ['asc', 'desc'])).toStrictEqual([
            { 'user': 'barney1', 'age': 34 },
            { 'user': 'barney2', 'age': 34 },
            { 'user': 'fred', 'age': 48 },
            { 'user': 'fred', 'age': 40 },
        ])
        expect(orderBy(users, ['user', 'age'], ['asc', 'asc'])).toStrictEqual([
            { 'user': 'barney1', 'age': 34 },
            { 'user': 'barney2', 'age': 34 },
            { 'user': 'fred', 'age': 40 },
            { 'user': 'fred', 'age': 48 },
        ])
        expect(orderBy(users, ['age', 'user'], ['asc', 'desc'])).toStrictEqual([
            { 'user': 'barney2', 'age': 34 },
            { 'user': 'barney1', 'age': 34 },
            { 'user': 'fred', 'age': 40 },
            { 'user': 'fred', 'age': 48 },
        ])
        expect(orderBy(users, ['age', 'user'], ['desc', 'asc'])).toStrictEqual([
            { 'user': 'fred', 'age': 48 },
            { 'user': 'fred', 'age': 40 },
            { 'user': 'barney1', 'age': 34 },
            { 'user': 'barney2', 'age': 34 },
        ])
        const nested = [
            { 'user': 'fred', 'nested': { 'age': 48 } },
            { 'user': 'barney1', 'nested': { 'age': 34 } },
            { 'user': 'fred', 'nested': { 'age': 40 } },
            { 'user': 'barney2', 'nested': { 'age': 34 } },
        ]
        expect(orderBy(nested, [item => item.nested.age, 'user'], ['asc', 'desc'])).toStrictEqual([
            { 'user': 'barney2', 'nested': { 'age': 34 } },
            { 'user': 'barney1', 'nested': { 'age': 34 } },
            { 'user': 'fred', 'nested': { 'age': 40 } },
            { 'user': 'fred', 'nested': { 'age': 48 } },
        ])
    })
})