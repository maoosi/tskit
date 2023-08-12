/**
 * Timestamp
 * 
 * @category Time
 */
export const timestamp = () => +Date.now()

/**
 * Convert Minutes to Hours and Minutes
 * 
 * @category Time
 */
export function toHoursAndMinutes(minutes: number): { hours: number, minutes: number, formatted: string } {
    const duration = {
        hours: Math.floor(minutes / 60),
        minutes: minutes % 60
    }
    return {
        hours: duration.hours,
        minutes: duration.minutes,
        formatted: [
            duration.hours > 0
                ? duration.hours + 'hrs'
                : null,
            duration.minutes > 0
                ? duration.minutes + 'min'
                : null
        ].filter(Boolean).join(' ')
    }
}

export function padToTwoDigits(value: number): string {
    return value.toString().padStart(2, '0')
}