import { describe, test, expect } from 'vitest'
import { merge, traverse, clone, mapValues } from './object'

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

    test('traverse', async () => {
        const d = new Date()
        const f = () => 2
        const obj1 = {
            a: 1,
            b: { _t: 'old', c: 3, d: { e: { _t: 'old', f: { _t: 'old', g: 7 } } } },
            c: [{ _t: 'old', i: [{ _t: 'old', j: { _t: 'old', k: 'hello' } }] }],
            d, f
        }
        const obj2 = {
            a: 1,
            b: { _t: 'new', c: 3, d: { _e: { _t: 'new', f: { _t: 'new', g: 7 } } } },
            c: [{ _t: 'new', i: [{ _t: 'old', j: { _t: 'old', k: 'hello' } }] }],
            d, f
        }
        expect(await traverse(obj1, async (node) => {
            if (node.key === '_t') node.set('new')
            if (node?.childKeys?.includes('e')) {
                const { e, ...value } = node.value
                node.set({ ...value, _e: node.value['e'] })
            }
            if (node.key === 'i') node.break()
        })).toStrictEqual(obj2)
        expect(obj1).not.toStrictEqual(obj2)
    })
})