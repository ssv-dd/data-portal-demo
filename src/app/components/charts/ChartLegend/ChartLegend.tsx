import type { LegendPosition } from '../types'

import * as S from './ChartLegend.styles'

type LegendPayloadEntry = {
  readonly value?: string
  readonly color?: string
}

interface ChartLegendProps {
  readonly position?: LegendPosition
  readonly payload?: readonly LegendPayloadEntry[]
}

/**
 * Theme-aware custom legend for Recharts.
 * Uses dot indicators instead of rectangles for a cleaner look.
 */
export function ChartLegend({ payload, position = 'bottom' }: ChartLegendProps) {
  if (!payload?.length) return null

  return (
    <S.LegendContainer $position={position}>
      {(payload as readonly LegendPayloadEntry[]).map((entry, i) => (
        <S.LegendItem key={`${entry.value ?? ''}-${i}`} title={entry.value}>
          <S.LegendDot $color={entry.color ?? 'var(--app-violet-500)'} />
          {entry.value}
        </S.LegendItem>
      ))}
    </S.LegendContainer>
  )
}
