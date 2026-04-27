import type { TooltipConfig } from '../types'
import { formatCompactNumber } from '../utils/formatters'

import * as S from './ChartTooltip.styles'

type RechartsPayloadEntry = {
  readonly name?: string
  readonly value?: number
  readonly color?: string
  readonly dataKey?: string
}

interface ChartTooltipProps {
  readonly config?: TooltipConfig
  readonly active?: boolean
  readonly payload?: readonly RechartsPayloadEntry[]
  readonly label?: string | number
}

const RAW_KEY_PATTERN = /^[a-z]$|^s\d+$|^value$|^y$/i

/**
 * Determines whether a series name looks like a raw data key
 * (e.g. "y", "s0", "value") rather than a human-readable label.
 */
function isRawKey(name: string): boolean {
  return RAW_KEY_PATTERN.test(name)
}

/**
 * Theme-aware custom tooltip for Recharts.
 *
 * Layout:
 *  ┌───────────────────────┐
 *  │ Date (x-label)        │  ← subdued uppercase label
 *  │ 03/31/26              │  ← formatted x-axis value
 *  │───────────────────────│
 *  │ ● Revenue    5.1M     │  ← series dot + name + value
 *  │ ● Orders     12.3K    │
 *  └───────────────────────┘
 *
 * For single-series charts, raw dataKey names (like "y") are
 * replaced with the configured yLabel.
 */
export function ChartTooltip({ active, payload, label, config }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  const formattedLabel = config?.labelFormatter
    ? config.labelFormatter(String(label ?? ''))
    : String(label ?? '')

  const isSingle = payload.length === 1

  return (
    <S.TooltipContainer>
      {formattedLabel && (
        <S.TooltipHeader>
          {config?.xLabel && <S.TooltipHeaderLabel>{config.xLabel}</S.TooltipHeaderLabel>}
          <S.TooltipHeaderValue>{formattedLabel}</S.TooltipHeaderValue>
        </S.TooltipHeader>
      )}

      {(payload as readonly RechartsPayloadEntry[]).map((entry, i) => {
        const raw = entry.value ?? 0
        const rawName = entry.name ?? entry.dataKey ?? ''

        const displayName = isRawKey(rawName) && config?.yLabel ? config.yLabel : rawName

        const formatted = config?.valueFormatter
          ? config.valueFormatter(raw, displayName)
          : formatCompactNumber(raw)

        return (
          <S.TooltipRow key={`${rawName}-${i}`}>
            <S.TooltipSeriesName>
              <S.TooltipDot $color={entry.color ?? 'var(--app-violet-500)'} />
              {isSingle && !config?.yLabel && isRawKey(rawName) ? 'Value' : displayName}
            </S.TooltipSeriesName>
            <S.TooltipValue>{formatted}</S.TooltipValue>
          </S.TooltipRow>
        )
      })}
    </S.TooltipContainer>
  )
}
