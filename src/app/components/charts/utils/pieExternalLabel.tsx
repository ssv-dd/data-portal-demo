import type { ReactElement } from 'react'
import type { PieLabelRenderProps } from 'recharts'

import { Theme } from '../../../styles/dataPortalAppTheme'
import { CHART_FONT } from '../constants'

import { truncateLabel } from './formatters'

const RADIAN = Math.PI / 180

export interface BuildExternalPieLabelOptions {
  /** When set, label text includes `name: {formatter(value)} (pct%)`. Otherwise `name (pct%)` only. */
  readonly labelValueFormatter?: (value: number) => string
  /**
   * Hide outside labels when slice share is below this (0–1). Set to `0` to always show (e.g. tiny
   * “Unknown” rows). Default: `0.03`.
   */
  readonly labelMinPercent?: number
  readonly nameMaxChars?: number
}

/**
 * Recharts `<Pie label={…} labelLine />` renderer — outside callout with leader line.
 */
export function buildExternalPieLabel(
  options: BuildExternalPieLabelOptions
): (props: PieLabelRenderProps) => ReactElement<SVGElement> | null {
  const nameMaxChars = options.nameMaxChars ?? 22
  const minPct = options.labelMinPercent !== undefined ? options.labelMinPercent : 0.03

  function ExternalPieLabel(props: PieLabelRenderProps): ReactElement<SVGElement> | null {
    const cx = Number(props.cx ?? 0)
    const cy = Number(props.cy ?? 0)
    const midAngle = Number(props.midAngle ?? 0)
    const outerRadius = Number(props.outerRadius ?? 0)
    const name = String(props.name ?? '')
    const value = Number(props.value ?? 0)
    const percent = Number(props.percent ?? 0)

    if (minPct > 0 && percent < minPct) {
      return null
    }

    const labelOffset = 22
    const radius = outerRadius + labelOffset
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    const pctText = `${(percent * 100).toFixed(2)}%`
    const shortName = truncateLabel(name, nameMaxChars)
    const body = options.labelValueFormatter
      ? `${shortName}: ${options.labelValueFormatter(value)} (${pctText})`
      : `${shortName} (${(percent * 100).toFixed(0)}%)`

    return (
      <text
        x={x}
        y={y}
        fill={Theme.usage.color.text.default}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={CHART_FONT.tickSize}
      >
        {body}
      </text>
    )
  }

  ExternalPieLabel.displayName = 'ExternalPieLabel'

  return ExternalPieLabel
}
