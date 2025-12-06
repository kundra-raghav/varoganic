const tripletRegex = /^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})$/
const rgbFunctionRegex = /^rgb[a]?\(([^)]+)\)$/i

const isRgbTriplet = (value: string): boolean => tripletRegex.test(value.trim())

const parseRgbTriplet = (value: string): [number, number, number] | null => {
  const match = tripletRegex.exec(value.trim())
  if (!match) {
    return null
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

const parseRgbFunction = (value: string): [number, number, number] | null => {
  const match = rgbFunctionRegex.exec(value.trim())
  if (!match) {
    return null
  }

  const parts = match[1].split(/[\s,/]+/).filter(Boolean)
  if (parts.length < 3) {
    return null
  }

  return [Number(parts[0]), Number(parts[1]), Number(parts[2])]
}

const parseHex = (value: string): [number, number, number] | null => {
  const hex = value.trim().replace(/^#/, '')
  if (![3, 6].includes(hex.length)) {
    return null
  }

  const expanded = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex

  const intVal = Number.parseInt(expanded, 16)
  if (Number.isNaN(intVal)) {
    return null
  }

  return [(intVal >> 16) & 255, (intVal >> 8) & 255, intVal & 255]
}

const resolveToken = (token: string): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const computed = getComputedStyle(document.documentElement).getPropertyValue(token)
  return computed.trim() || null
}

const parseColor = (input: string): [number, number, number] | null => {
  const value = input.trim()

  if (value.startsWith('var(')) {
    const tokenName = value.slice(4, -1).trim()
    if (!tokenName) {
      return null
    }
    const resolved = resolveToken(tokenName)
    if (!resolved) {
      return null
    }
    return parseColor(resolved)
  }

  if (isRgbTriplet(value)) {
    return parseRgbTriplet(value)
  }

  if (value.startsWith('rgb')) {
    return parseRgbFunction(value)
  }

  if (value.startsWith('#')) {
    return parseHex(value)
  }

  return null
}

const channelToLinear = (channel: number): number => {
  const normalized = channel / 255
  return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4)
}

const relativeLuminance = (rgb: [number, number, number]): number => {
  const [r, g, b] = rgb
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b)
}

/**
 * Returns the WCAG contrast ratio for the provided color pair. Values range
 * from 1 (no contrast) to 21 (max contrast). Returns `null` if parsing fails.
 */
export const getContrastRatio = (foreground: string, background: string): number | null => {
  const foregroundRgb = parseColor(foreground)
  const backgroundRgb = parseColor(background)

  if (!foregroundRgb || !backgroundRgb) {
    return null
  }

  const foregroundLum = relativeLuminance(foregroundRgb)
  const backgroundLum = relativeLuminance(backgroundRgb)

  const lighter = Math.max(foregroundLum, backgroundLum)
  const darker = Math.min(foregroundLum, backgroundLum)

  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2))
}

/**
 * Indicates whether the color pairing meets the provided WCAG contrast target.
 */
export const meetsContrast = (foreground: string, background: string, minimum = 4.5): boolean => {
  const ratio = getContrastRatio(foreground, background)
  return typeof ratio === 'number' && ratio >= minimum
}

export type ContrastReport = {
  readonly ratio: number | null
  readonly passes: boolean
}

/**
 * Convenience helper returning the raw ratio and a boolean pass flag.
 */
export const getContrastReport = (
  foreground: string,
  background: string,
  minimum = 4.5,
): ContrastReport => {
  const ratio = getContrastRatio(foreground, background)
  return {
    ratio,
    passes: typeof ratio === 'number' ? ratio >= minimum : false,
  }
}
