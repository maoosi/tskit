import { describe, test, expect } from 'vitest'
import { parse, stringify } from './json'

describe('json', () => {
    test('parse', () => {
        const json = { a: 'foo', b: 'bar' }
        expect(parse(JSON.stringify(json))).toStrictEqual(json)
        expect(parse(JSON.stringify(undefined))).toStrictEqual(undefined)
        expect(parse(JSON.stringify(() => null))).toStrictEqual(undefined)
        expect(parse(JSON.stringify(undefined), json)).toStrictEqual(json)
        expect(parse(JSON.stringify(undefined), null)).toStrictEqual(null)
        expect(() => parse(JSON.stringify(undefined), new Error('Issue'))).toThrowError('Issue')
    })

    test('stringify', () => {
        const json = { a: 'foo', b: 'bar' }
        expect(stringify(json)).toStrictEqual(JSON.stringify(json))
        expect(stringify(new Date())).toStrictEqual(undefined)
        expect(stringify(undefined)).toStrictEqual(undefined)
        expect(stringify(() => null)).toStrictEqual(undefined)
        expect(stringify(undefined, JSON.stringify(json))).toStrictEqual(JSON.stringify(json))
        expect(stringify(new Date(), null)).toStrictEqual(null)
        expect(() => stringify(new Date(), new Error('Issue'))).toThrowError('Issue')
    })
})