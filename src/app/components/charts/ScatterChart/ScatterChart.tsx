import { useMemo } from 'react'
import {
  Brush,
  CartesianGrid,
  Legend,
  Scatter,
  ScatterChart as RechartsScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'

import { ChartLegend } from '../ChartLegend'
import { ChartTooltip } from '../ChartTooltip'
import { ChartWrapper } from '../ChartWrapper'
import { CHART_DEFAULTS, CHART_FONT, CHART_MARGINS, CHART_PALETTE } from '../constants'
import type { ScatterChartProps } from '../types'
import { useChartTheme } from '../utils/chartTheme'
import { defaultAxisFormatter } from '../utils/formatters'

export function DPScatterChart({
  data,
  xAxisKey,
  series,
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
  xAxisType = 'number',
  yAxisType = 'number',
  zRange = [24, 200],
}: ScatterChartProps) {
  const theme = useChartTheme()
  const palette = colors ?? CHART_PALETTE
  const xFormatter = xAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v, xAxis?.maxTickChars))
  const yFormatter = yAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v))

  const mutableData = useMemo(() => [...data], [data])
  const zSeries = useMemo(() => series.find((s) => s.zDataKey), [series])

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
        <RechartsScatterChart
          width={width}
          height={h}
          data={mutableData}
          margin={{ ...CHART_MARGINS, ...margin }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray={gridDashed ? '3 3' : undefined} stroke={theme.gridStroke} />
          )}

          <XAxis
            type={xAxisType}
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
            type={yAxisType}
            tickFormatter={yFormatter}
            tick={{ fontSize: CHART_FONT.tickSize, fill: theme.tickFill }}
            stroke={theme.axisStroke}
            hide={yAxis?.hide}
            label={
              yAxis?.label
                ? {
                    value: yAxis.label,
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: CHART_FONT.labelSize, fill: theme.tickFill },
                  }
                : undefined
            }
          />

          {zSeries?.zDataKey && (
            <ZAxis dataKey={zSeries.zDataKey} type="number" range={zRange} name={zSeries.name} />
          )}

          <Tooltip
            content={<ChartTooltip config={tooltip} />}
            cursor={{ strokeDasharray: '3 3', stroke: theme.axisStroke }}
          />

          {!legend?.hide && (
            <Legend
              content={<ChartLegend position={legend?.position} />}
              verticalAlign={legend?.position === 'top' ? 'top' : 'bottom'}
            />
          )}

          {series.map((s, i) => (
            <Scatter
              key={`${s.name}-${s.yDataKey}`}
              name={s.name}
              dataKey={s.yDataKey}
              fill={s.color ?? palette[i % palette.length]}
              isAnimationActive={animate}
              animationDuration={CHART_DEFAULTS.animationDuration}
              animationEasing={CHART_DEFAULTS.animationEasing}
            />
          ))}

          {brush?.enabled && (
            <Brush
              dataKey={xAxisKey}
              height={brush.height ?? CHART_DEFAULTS.brushHeight}
              stroke={theme.axisStroke}
              startIndex={brush.defaultRange?.[0]}
              endIndex={brush.defaultRange?.[1]}
            />
          )}
        </RechartsScatterChart>
      )}
    </ChartWrapper>
  )
}
