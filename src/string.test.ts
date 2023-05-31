import { describe, test, expect } from 'vitest'
import { capitalize } from './string'

describe('string', () => {
    test('capitalize', () => {
        expect(capitalize('hello World')).toEqual('Hello world')
        expect(capitalize('123')).toEqual('123')
        expect(capitalize('中国')).toEqual('中国')
        expect(capitalize('āÁĂÀ')).toEqual('Āáăà')
        expect(capitalize('\a')).toEqual('A')
    })
})