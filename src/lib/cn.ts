import { clsx, type ClassValue } from 'clsx'

/**
 * Utility for composing className strings with Tailwind tokens.
 */
export const cn = (...inputs: Array<ClassValue>): string => {
  return clsx(inputs)
}
