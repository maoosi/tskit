/**
 * First letter uppercase
 * 
 * @category String
 */
export function upperFirst<S extends string>(str: S): Capitalize<S> {
    return (
        !str ? '' : str[0].toUpperCase() + str.slice(1)
    ) as Capitalize<S>;
}

// port from nanoid
// https://github.com/ai/nanoid
/**
 * Generate a random string
 * @category String
 */
export function nanoid(size = 16, alphabet: 'digits' | 'url' = 'url') {
    const dict = alphabet === 'digits' ? '2619834075' : 'useandom2619834075pxbfghjklqvwyzrict'
    let id = ''
    let i = size
    const len = dict.length
    while (i--)
        id += dict[(Math.random() * len) | 0]
    return id
}

/**
 * Break string based of max characters
 * 
 * @category String
 */
export function breakOnMaxChars(str: string, maxCharsPerLine: number): string[] {
    const words = str.split(' ')
    const lines: string[] = []
    let currentLine = ''
    for (const word of words) {
        if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
            currentLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine)
    return lines
}