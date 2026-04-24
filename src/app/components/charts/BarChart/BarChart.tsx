import { useMemo } from 'react'
import {
  Bar,
  BarChart as RechartsBarChart,
  Brush,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartLegend } from '../ChartLegend'
import { ChartTooltip } from '../ChartTooltip'
import { ChartWrapper } from '../ChartWrapper'
import { CHART_DEFAULTS, CHART_FONT, CHART_MARGINS, CHART_PALETTE } from '../constants'
import type { BarChartProps } from '../types'
import { useChartTheme } from '../utils/chartTheme'
import { defaultAxisFormatter } from '../utils/formatters'

export function DPBarChart({
  data,
  xAxisKey,
  yAxisKey,
  height = CHART_DEFAULTS.height,
  className,
  style,
  animate = true,
  responsive = true,
  xAxis,
  yAxis,
  showGrid = true,
  gridDashed = true,
  legend,
  tooltip,
  colors,
  brush,
  margin,
  loading,
  error,
  emptyMessage,
  barRadius = CHART_DEFAULTS.barRadius,
  barSize = CHART_DEFAULTS.barSize,
}: BarChartProps) {
  const theme = useChartTheme()
  const palette = colors ?? CHART_PALETTE
  const fill = palette[0] ?? CHART_PALETTE[0]
  const xFormatter = xAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v, xAxis?.maxTickChars))
  const yFormatter = yAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v))

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
        <RechartsBarChart
          width={width}
          height={h}
          data={mutableData}
          margin={{ ...CHART_MARGINS, ...margin }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray={gridDashed ? '3 3' : undefined}
              stroke={theme.gridStroke}
              vertical={false}
            />
          )}

          <XAxis
            dataKey={xAxisKey}
            tickFormatter={xFormatter}
            tick={{ fontSize: CHART_FONT.tickSize, fill: theme.tickFill }}
            stroke={theme.axisStroke}
            label={
              xAxis?.label
                ? {
                    value: xAxis.label,
                    position: 'insideBottom',
                    offset: -4,
                    fontSize: CHART_FONT.labelSize,
                    fill: theme.tickFill,
                  }
                : undefined
            }
            hide={xAxis?.hide}
            tickCount={xAxis?.tickCount}
          />
          <YAxis
            tickFormatter={yFormatter}
            tick={{ fontSize: CHART_FONT.tickSize, fill: theme.tickFill }}
            stroke={theme.axisStroke}
            hide={yAxis?.hide}
          />

          <Tooltip
            content={<ChartTooltip config={tooltip} />}
            cursor={{ fill: 'rgb(var(--app-muted-rgb) / 0.15)' }}
          />

          {!legend?.hide && (
            <Legend
              content={<ChartLegend position={legend?.position} />}
              verticalAlign={legend?.position === 'top' ? 'top' : 'bottom'}
            />
          )}

          <Bar
            dataKey={yAxisKey}
            name={yAxis?.label ?? yAxisKey}
            fill={fill}
            radius={[barRadius, barRadius, 0, 0]}
            maxBarSize={barSize}
            isAnimationActive={animate}
            animationDuration={CHART_DEFAULTS.animationDuration}
            animationEasing={CHART_DEFAULTS.animationEasing}
          />

          {brush?.enabled && (
            <Brush
              dataKey={xAxisKey}
              height={brush.height ?? CHART_DEFAULTS.brushHeight}
              stroke={theme.axisStroke}
              startIndex={brush.defaultRange?.[0]}
              endIndex={brush.defaultRange?.[1]}
            />
          )}
        </RechartsBarChart>
      )}
    </ChartWrapper>
  )
}
