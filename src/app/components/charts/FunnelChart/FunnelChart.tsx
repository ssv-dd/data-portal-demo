import { useMemo } from 'react'
import { Cell, Funnel, FunnelChart as RechartsFunnelChart, Legend, Tooltip } from 'recharts'

import { ChartLegend } from '../ChartLegend'
import { ChartTooltip } from '../ChartTooltip'
import { ChartWrapper } from '../ChartWrapper'
import { CHART_DEFAULTS, CHART_MARGINS, CHART_PALETTE } from '../constants'
import type { FunnelChartProps } from '../types'

export function DPFunnelChart({
  data,
  height = CHART_DEFAULTS.height,
  className,
  style,
  animate = true,
  responsive = true,
  colors,
  legend,
  tooltip,
  margin,
  loading,
  error,
  emptyMessage,
  reversed = false,
}: FunnelChartProps) {
  const palette = colors ?? CHART_PALETTE
  const mutableData = useMemo(() => [...data], [data])

  return (
    <ChartWrapper
      loading={loading}
      error={error}
      emptyMessage={emptyMessage}
      isEmpty={data.length === 0}
      height={height}
      className={className}
      style={style}
      responsive={responsive}
    >
      {(width, h) => (
        <RechartsFunnelChart
          width={width}
          height={h}
          data={mutableData}
          margin={{ ...CHART_MARGINS, ...margin }}
        >
          <Tooltip content={<ChartTooltip config={tooltip} />} />

          {!legend?.hide && (
            <Legend
              content={<ChartLegend position={legend?.position} />}
              verticalAlign={legend?.position === 'top' ? 'top' : 'bottom'}
            />
          )}

          <Funnel
            dataKey="value"
            nameKey="name"
            reversed={reversed}
            isAnimationActive={animate}
            animationDuration={CHART_DEFAULTS.animationDuration}
            animationEasing={CHART_DEFAULTS.animationEasing}
          >
            {mutableData.map((_, i) => (
              <Cell key={`funnel-cell-${i}`} fill={palette[i % palette.length]} />
            ))}
          </Funnel>
        </RechartsFunnelChart>
      )}
    </ChartWrapper>
  )
}
