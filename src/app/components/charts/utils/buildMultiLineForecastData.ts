import type { DataPoint, SeriesConfig } from '../types'

function toNullableNumber(v: unknown): number | null {
  if (v === null || v === undefined) return null
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

export function forecastHistKey(dataKey: string): string {
  return `__dpml_${dataKey}__h`
}

export function forecastFcKey(dataKey: string): string {
  return `__dpml_${dataKey}__f`
}

/**
 * When any `series` entry defines `forecastFromIndex`, returns rows augmented with
 * `__dpml_<dataKey>__h` / `__dpml_<dataKey>__f` keys so two `<Line />` segments can share one color.
 * Otherwise returns a shallow copy of `data` unchanged.
 */
export function enrichMultiLineDataWithForecast(
  data: readonly DataPoint[],
  series: readonly SeriesConfig[]
): DataPoint[] {
  const hasForecast = series.some((s) => s.forecastFromIndex !== undefined)
  if (!hasForecast) {
    return [...data]
  }

  return data.map((row, i) => {
    const out: DataPoint = { ...row }
    for (const s of series) {
      const split = s.forecastFromIndex
      if (split === undefined) continue

      const hKey = forecastHistKey(s.dataKey)
      const fKey = forecastFcKey(s.dataKey)
      const v = toNullableNumber(row[s.dataKey])

      if (v === null) {
        out[hKey] = null
        out[fKey] = null
        continue
      }

      if (split <= 0) {
        out[hKey] = null
        out[fKey] = v
      } else if (split >= data.length) {
        out[hKey] = v
        out[fKey] = null
      } else if (i < split) {
        out[hKey] = v
        out[fKey] = i === split - 1 ? v : null
      } else {
        out[hKey] = null
        out[fKey] = v
      }
    }
    return out
  })
}

export function seriesUsesForecastSplit(s: SeriesConfig): boolean {
  return s.forecastFromIndex !== undefined
}
