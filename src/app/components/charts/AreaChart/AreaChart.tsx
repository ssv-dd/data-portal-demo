import { useMemo } from 'react'
import {
  Area,
  AreaChart as RechartsAreaChart,
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
import type { AreaChartProps } from '../types'
import { useChartTheme } from '../utils/chartTheme'
import { defaultAxisFormatter } from '../utils/formatters'

const GRADIENT_ID = 'dp-area-gradient'

export function DPAreaChart({
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
  curved = true,
  fillOpacity = CHART_DEFAULTS.fillOpacity,
  strokeWidth = CHART_DEFAULTS.strokeWidth,
}: AreaChartProps) {
  const theme = useChartTheme()
  const palette = colors ?? CHART_PALETTE
  const strokeColor = palette[0] ?? CHART_PALETTE[0]
  const xFormatter = xAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v, xAxis?.maxTickChars))
  const yFormatter = yAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v))

  const mutableData = useMemo(() => [...data], [data])
  const gradientId = useMemo(() => `${GRADIENT_ID}-${Math.random().toString(36).slice(2, 8)}`, [])

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
        <RechartsAreaChart
          width={width}
          height={h}
          data={mutableData}
          margin={{ ...CHART_MARGINS, ...margin }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={fillOpacity} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.01} />
            </linearGradient>
          </defs>

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
            cursor={{ stroke: theme.axisStroke, strokeDasharray: '4 4' }}
          />

          {!legend?.hide && (
            <Legend
              content={<ChartLegend position={legend?.position} />}
              verticalAlign={legend?.position === 'top' ? 'top' : 'bottom'}
            />
          )}

          <Area
            type={curved ? 'monotone' : 'linear'}
            dataKey={yAxisKey}
            name={yAxis?.label ?? yAxisKey}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={`url(#${gradientId})`}
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
        </RechartsAreaChart>
      )}
    </ChartWrapper>
  )
}
