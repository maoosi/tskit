/**
 * Random number
 * 
 * @category Math
 */
export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Clamp between min and max
 * 
 * @category Math
 */
export function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n))
}