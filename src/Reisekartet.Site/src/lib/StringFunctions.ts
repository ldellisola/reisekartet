export function isNullOrWhitespace(input: string | null | undefined): boolean {
  if (typeof input === 'undefined' || input === null) return true
  return input.trim().length === 0
}

export function getColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }

  return color
}

export function containsIgnoreCase(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  if (isNullOrWhitespace(a) && isNullOrWhitespace(b)) return true
  if (isNullOrWhitespace(b)) return true
  if (isNullOrWhitespace(a)) return false
  return a!.toLocaleLowerCase().includes(b!.toLocaleLowerCase())
}
