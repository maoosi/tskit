import { describe, test, expect } from 'vitest'
import { upperFirst } from './string'

describe('string', () => {
    test('upperFirst', () => {
        expect(upperFirst('hello World')).toEqual('Hello World')
        expect(upperFirst('123')).toEqual('123')
        expect(upperFirst('中国')).toEqual('中国')
        expect(upperFirst('āÁĂÀ')).toEqual('ĀÁĂÀ')
        expect(upperFirst('\a')).toEqual('A')
    })
})