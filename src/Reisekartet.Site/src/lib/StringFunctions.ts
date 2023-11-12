export default function isNullOrWhitespace(input: string | null | undefined): boolean {
  if (typeof input === 'undefined' || input === null) return true
  return input.trim().length === 0
}
