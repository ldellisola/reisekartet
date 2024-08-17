export function isNullOrWhitespace(input: string | null | undefined): boolean {
  if (typeof input === 'undefined' || input === null) return true
  return input.trim().length === 0
}

const colorMap: { [key: string]: string } = {}

export function getColor(str: string): string {
  if (colorMap[str]) return colorMap[str]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }
  colorMap[str] = color
  return color
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}
function getLuminance(hexColor: string) {
  const rgb = hexToRgb(hexColor)
  const a = rgb.map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}

export function getTextColor(str: string) {
  const luminance = getLuminance(getColor(str))
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
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

export function stripChars(str: string, chars: string): string {
  return str
    .split('')
    .filter((c) => !chars.includes(c))
    .join('')
}
