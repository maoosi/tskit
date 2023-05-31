import { describe, test, expect } from 'vitest'
import { isObject, isArray } from './is'

describe('is', () => {
    test('isObject', () => {
        expect(isObject({})).toBeTruthy()
        expect(isObject([])).toBeFalsy()
        expect(isObject(() => true)).toBeFalsy()
        expect(isObject(null)).toBeFalsy()
        expect(isObject(undefined)).toBeFalsy()
        expect(isObject(new Date)).toBeFalsy()
    })

    test('isArray', () => {
        expect(isArray([])).toBeTruthy()
        expect(isArray(null)).toBeFalsy()
        expect(isArray(undefined)).toBeFalsy()
    })
})