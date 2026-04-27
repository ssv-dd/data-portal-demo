import { useMemo } from 'react'
import { PolarAngleAxis, RadialBar, RadialBarChart, Tooltip } from 'recharts'

import { ChartTooltip } from '../ChartTooltip'
import { ChartWrapper } from '../ChartWrapper'
import { CHART_DEFAULTS, CHART_PALETTE } from '../constants'
import type { GaugeChartProps } from '../types'
import { useChartTheme } from '../utils/chartTheme'
import { formatCompactNumber } from '../utils/formatters'

import * as S from './GaugeChart.styles'

const DEFAULT_START = 200
const DEFAULT_END = -20

export function DPGaugeChart({
  value,
  min = 0,
  max = 100,
  height = CHART_DEFAULTS.height,
  className,
  style,
  animate = true,
  responsive = true,
  fill,
  trackColor,
  tooltip,
  label,
  formatValue,
  startAngle = DEFAULT_START,
  endAngle = DEFAULT_END,
  innerRadius = '72%',
  outerRadius = '100%',
  loading,
  error,
  emptyMessage,
}: GaugeChartProps) {
  const theme = useChartTheme()
  const accent = fill ?? CHART_PALETTE[0]
  const track = trackColor ?? theme.gridStroke

  const clamped = useMemo(() => {
    if (!Number.isFinite(value)) return min
    return Math.min(max, Math.max(min, value))
  }, [max, min, value])

  const chartData = useMemo(() => [{ name: 'value', value: clamped, fill: accent }], [accent, clamped])

  const display = formatValue ? formatValue(clamped) : formatCompactNumber(clamped)
  const isEmpty = !Number.isFinite(value)

  return (
    <ChartWrapper
      loading={loading}
      error={error}
      emptyMessage={emptyMessage}
      isEmpty={isEmpty}
      height={height}
      className={className}
      style={style}
      responsive={responsive}
    >
      {(width, h) => (
        <div style={{ position: 'relative', width, height: h }}>
          <RadialBarChart
            width={width}
            height={h}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            data={chartData}
            startAngle={startAngle}
            endAngle={endAngle}
            margin={{ top: 4, right: 8, bottom: 4, left: 8 }}
          >
            <PolarAngleAxis type="number" domain={[min, max]} tick={false} allowDataOverflow />
            <RadialBar
              dataKey="value"
              cornerRadius={8}
              background={{ fill: track }}
              isAnimationActive={animate}
              animationDuration={CHART_DEFAULTS.animationDuration}
              animationEasing={CHART_DEFAULTS.animationEasing}
            />
            <Tooltip
              content={
                <ChartTooltip
                  config={{
                    ...tooltip,
                    xLabel: tooltip?.xLabel ?? label,
                    yLabel: tooltip?.yLabel ?? 'Value',
                    valueFormatter: tooltip?.valueFormatter ?? ((_v: number, _name: string) => display),
                  }}
                />
              }
            />
          </RadialBarChart>

          <S.CenterStack>
            <S.ValueText>{display}</S.ValueText>
            {label && <S.LabelText>{label}</S.LabelText>}
          </S.CenterStack>
        </div>
      )}
    </ChartWrapper>
  )
}
