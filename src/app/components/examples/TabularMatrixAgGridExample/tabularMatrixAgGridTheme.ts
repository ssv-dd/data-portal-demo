import type { CellClassParams, ColDef, RowClassParams, RowStyle } from 'ag-grid-community'

import { Theme } from '../../../styles/dataPortalAppTheme'

/** Typography aligned with chart widgets / dense tables. */
export const matrixCellFontSize = Theme.usage.fontSize.small

export const matrixCellPadding = {
  paddingTop: Theme.usage.space.xxSmall,
  paddingBottom: Theme.usage.space.xxSmall,
} as const

const elevated = Theme.usage.color.background.elevated.default
const subdued = Theme.usage.color.background.subdued.default
const highlightSubdued = Theme.usage.color.highlight.subdued.default
const highlightStrong = Theme.usage.color.highlight.strong.default
const borderDefault = Theme.usage.color.border.default
const strongSurface = Theme.usage.color.background.strong.default

/** One surface for the entire grand-total strip (row + cells) so heatmap / Quartz pinned tokens do not fight it. */
const grandTotalRowBackground = `color-mix(in srgb, ${subdued} 24%, ${strongSurface})`

function isGrandTotalFooter(params: {
  node?: { rowPinned?: 'top' | 'bottom' | null | undefined } | null
  data?: unknown
}): boolean {
  if (params.node?.rowPinned === 'bottom') return true
  const d = params.data
  if (!d || typeof d !== 'object' || !('portfolioCategory' in d)) return false
  return (d as { portfolioCategory: string }).portfolioCategory === 'Grand Total'
}

/** Pinned footer cells: no heatmap (totals always max the per-column scale), always primary text. */
function grandTotalCellStyle(): {
  fontSize: typeof matrixCellFontSize
  fontWeight: 700
  color: string
  backgroundColor: string
} {
  return {
    fontSize: matrixCellFontSize,
    fontWeight: 700,
    color: Theme.usage.color.text.default,
    backgroundColor: grandTotalRowBackground,
  }
}

function heatmapBackground(t: number, strong: boolean): string {
  if (strong) {
    const pct = 22 + t * 48
    return `color-mix(in srgb, ${highlightStrong} ${pct.toFixed(1)}%, ${elevated})`
  }
  const pct = 6 + t * 34
  return `color-mix(in srgb, ${highlightSubdued} ${pct.toFixed(1)}%, ${elevated})`
}

/**
 * Per-column heatmap using highlight tokens (same family as filters, settings accents)
 * so the grid matches Data Portal light/dark surfaces.
 */
export function createMatrixHeatmapCellStyle<T>(
  field: string,
  heatmapFields: ReadonlySet<string>,
  mins: Record<string, number>,
  maxs: Record<string, number>
): ColDef<T>['cellStyle'] {
  return (params) => {
    if (!heatmapFields.has(field)) return undefined
    if (isGrandTotalFooter(params)) {
      return grandTotalCellStyle()
    }
    const v = params.value
    if (v === null || v === undefined || typeof v !== 'number') {
      return {
        fontSize: matrixCellFontSize,
        fontWeight: 400,
        color: Theme.usage.color.text.subdued.default,
        backgroundColor: `color-mix(in srgb, ${subdued} 55%, ${elevated})`,
      }
    }
    const lo = mins[field]
    const hi = maxs[field]
    if (lo === undefined || hi === undefined) {
      return undefined
    }
    if (hi <= lo) {
      return {
        fontSize: matrixCellFontSize,
        fontWeight: 400,
        color: Theme.usage.color.text.default,
        backgroundColor: `color-mix(in srgb, ${highlightSubdued} 18%, ${elevated})`,
      }
    }
    const t = (v - lo) / (hi - lo)
    const strong = t > 0.72
    return {
      fontSize: matrixCellFontSize,
      color: strong ? Theme.usage.color.text.inverse.default : Theme.usage.color.text.default,
      fontWeight: strong ? 600 : 400,
      backgroundColor: heatmapBackground(t, strong),
    }
  }
}

export function getTabularMatrixRowStyle(params: RowClassParams): RowStyle | undefined {
  if (isGrandTotalFooter(params)) {
    return {
      fontSize: matrixCellFontSize,
      fontWeight: 700,
      color: Theme.usage.color.text.default,
      backgroundColor: grandTotalRowBackground,
      borderTop: `1px solid ${borderDefault}`,
    }
  }
  if ((params.node?.rowIndex ?? 0) % 2 === 1) {
    return {
      fontSize: matrixCellFontSize,
      fontWeight: 400,
      color: Theme.usage.color.text.default,
      backgroundColor: `color-mix(in srgb, ${subdued} 35%, ${elevated})`,
    }
  }
  return {
    fontSize: matrixCellFontSize,
    fontWeight: 400,
    color: Theme.usage.color.text.default,
  }
}

export const matrixPinnedTextCellStyle = {
  fontSize: matrixCellFontSize,
  fontWeight: 400,
  color: Theme.usage.color.text.default,
} as const

export function matrixPinnedDimensionCellStyle<T>(
  params: CellClassParams<T>
): typeof matrixPinnedTextCellStyle | ReturnType<typeof grandTotalCellStyle> {
  if (isGrandTotalFooter(params)) {
    return grandTotalCellStyle()
  }
  return matrixPinnedTextCellStyle
}
