import { describe, expect, test } from 'vitest'
import { clone, mapValues, merge, walk } from './object'

describe('object', () => {
    test('clone', () => {
        const obj1 = { a: ['A', 'B'] }
        expect(clone(obj1)).toStrictEqual({ a: ['A', 'B'] })
        expect(clone(obj1)).not.toBe(obj1)
    })

    test('merge', () => {
        const obj0 = { a: ['A', 'B'] }
        const obj1 = clone(obj0)
        const obj2 = { a: ['C'], b: ['D'] }
        expect(merge(obj1, obj2)).toStrictEqual({ a: ['A', 'B', 'C'], b: ['D'] })
        expect(obj1).toStrictEqual(obj0)
    })

    test('mapValues', () => {
        const users = {
            'fred': { 'user': 'fred', 'age': 40 },
            'pebbles': { 'user': 'pebbles', 'age': 1 }
        }
        expect(mapValues(users, function (o) { return o.age; })).toStrictEqual({ 'fred': 40, 'pebbles': 1 })
        expect(mapValues(users, 'age')).toStrictEqual({ 'fred': 40, 'pebbles': 1 })
    })

    test('walk', async () => {
        const d = new Date()
        const f = () => 2
        const obj1 = {
            a: 1,
            b: { _t: 'old', c: 3, z: { e: { _t: 'old', f: { _t: 'old', g: 7 } } } },
            c: [{ _t: 'old', i: [{ _t: 'old', j: { _t: 'old', k: 'hello' } }] }, { x: 'y' }],
            d, f
        }
        const obj2 = {
            a: 1,
            b: { _t: 'new', c: 3, z: { _e: { _t: 'new', f: { _t: 'new', g: 7 } } } },
            c: [{ _t: 'new', i: [{ _t: 'old', j: { _t: 'old', k: 'hello' } }] }, { x: 'y' }],
            d, f
        }
        expect(await walk(obj1, async ({ key, value }, node) => {
            if (key === '_t') value = 'new'
            if (key === 'e') key = '_e'
            if (key === 'i') node.ignoreChilds()
            return { key, value }
        })).toStrictEqual(obj2)
        expect(obj1).not.toStrictEqual(obj2)
    })
})