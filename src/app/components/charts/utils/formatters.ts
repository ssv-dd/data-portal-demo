/**
 * Number and label formatting utilities shared across all chart types.
 */

const SUFFIXES = [
  { threshold: 1_000_000_000, suffix: 'B' },
  { threshold: 1_000_000, suffix: 'M' },
  { threshold: 1_000, suffix: 'K' },
] as const

/**
 * Scale a number by `divisor` and append `suffix`, for headline figures (e.g. `61.335M`).
 * `decimals` defaults to 3 for stable width in KPI compare cards.
 */
export function formatScaledSuffix(value: number, divisor: number, suffix: string, decimals = 3): string {
  if (!Number.isFinite(value)) {
    return ''
  }
  return `${(value / divisor).toFixed(decimals)}${suffix}`
}

/** 1234567 → "1.23M", 850 → "850" */
export function formatCompactNumber(value: unknown): string {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return String(value ?? '')

  const abs = Math.abs(num)
  for (const { threshold, suffix } of SUFFIXES) {
    if (abs >= threshold) {
      const scaled = num / threshold
      const decimals = abs >= threshold * 10 ? 1 : 2
      return `${scaled.toFixed(decimals)}${suffix}`
    }
  }
  return num.toLocaleString()
}

/** Truncate with ellipsis, keeping the string within `maxChars`. */
export function truncateLabel(label: string, maxChars: number): string {
  if (label.length <= maxChars) return label
  return `${label.slice(0, Math.max(1, maxChars - 1))}…`
}

/** Default axis formatter: compact numbers for numeric values, truncated strings otherwise. */
export function defaultAxisFormatter(value: unknown, maxChars = 14): string {
  if (typeof value === 'number') return formatCompactNumber(value)
  const str = String(value ?? '')
  return truncateLabel(str, maxChars)
}
