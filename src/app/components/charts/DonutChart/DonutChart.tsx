import { useMemo } from 'react'
import { Cell, Legend, Pie, PieChart as RechartsPieChart, Tooltip } from 'recharts'

import { ChartLegend } from '../ChartLegend'
import { ChartTooltip } from '../ChartTooltip'
import { ChartWrapper } from '../ChartWrapper'
import { CHART_DEFAULTS, CHART_PALETTE } from '../constants'
import type { DonutChartProps } from '../types'
import { buildExternalPieLabel } from '../utils/pieExternalLabel'

import * as S from './DonutChart.styles'

export function DPDonutChart({
  data,
  height = CHART_DEFAULTS.height,
  className,
  style,
  animate = true,
  responsive = true,
  colors,
  legend,
  tooltip,
  loading,
  error,
  emptyMessage,
  innerRadiusRatio = CHART_DEFAULTS.donutInnerRadiusRatio,
  centerContent,
  showLabels = true,
  labelValueFormatter,
  labelMinPercent,
  labelNameMaxChars,
}: DonutChartProps) {
  const palette = colors ?? CHART_PALETTE
  const mutableData = useMemo(() => [...data], [data])

  const labelRenderer = useMemo(
    () =>
      showLabels
        ? buildExternalPieLabel({
            labelValueFormatter,
            labelMinPercent,
            nameMaxChars: labelNameMaxChars,
          })
        : undefined,
    [labelMinPercent, labelNameMaxChars, labelValueFormatter, showLabels]
  )

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
      {(width, h) => {
        const outerR = Math.min(width, h) * (showLabels ? 0.3 : 0.36)
        const innerR = outerR * innerRadiusRatio

        return (
          <div style={{ position: 'relative', width, height: h }}>
            <RechartsPieChart width={width} height={h}>
              <Pie
                data={mutableData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={outerR}
                innerRadius={innerR}
                paddingAngle={2}
                cornerRadius={4}
                label={labelRenderer}
                labelLine={showLabels}
                isAnimationActive={animate}
                animationDuration={CHART_DEFAULTS.animationDuration}
                animationEasing={CHART_DEFAULTS.animationEasing}
              >
                {mutableData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={palette[i % palette.length]} />
                ))}
              </Pie>

              <Tooltip content={<ChartTooltip config={tooltip} />} />

              {!legend?.hide && (
                <Legend
                  content={<ChartLegend position={legend?.position} />}
                  verticalAlign={legend?.position === 'top' ? 'top' : 'bottom'}
                />
              )}
            </RechartsPieChart>

            {centerContent && <S.CenterContent>{centerContent}</S.CenterContent>}
          </div>
        )
      }}
    </ChartWrapper>
  )
}
