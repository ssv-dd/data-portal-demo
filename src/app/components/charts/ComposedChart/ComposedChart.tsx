import { useMemo, useCallback } from 'react'
import {
  Area,
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartLegend } from '../ChartLegend'
import { ChartTooltip } from '../ChartTooltip'
import { ChartWrapper } from '../ChartWrapper'
import { CHART_DEFAULTS, CHART_FONT, CHART_MARGINS, CHART_PALETTE } from '../constants'
import type { ComposedChartProps } from '../types'
import { useChartTheme } from '../utils/chartTheme'
import { defaultAxisFormatter } from '../utils/formatters'

const AREA_GRADIENT_PREFIX = 'dp-composed-area'

export function DPComposedChart({
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
  rightYAxis,
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
  curved = true,
  strokeWidth = CHART_DEFAULTS.strokeWidth,
  fillOpacity = CHART_DEFAULTS.fillOpacity,
}: ComposedChartProps) {
  const theme = useChartTheme()
  const palette = colors ?? CHART_PALETTE
  const xFormatter = xAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v, xAxis?.maxTickChars))
  const yFormatter = yAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v))
  const rightYFormatter = rightYAxis?.formatter ?? yFormatter

  const hasRightAxis = useMemo(() => series.some((s) => s.yAxisId === 'right'), [series])

  const mergedMargin = useMemo(() => {
    const base = { ...CHART_MARGINS, ...margin }
    if (!hasRightAxis) return base
    return {
      ...base,
      right: Math.max(base.right ?? CHART_MARGINS.right, 36),
    }
  }, [margin, hasRightAxis])

  const mutableData = useMemo(() => [...data], [data])
  const areaGradientIds = useMemo(
    () => series.map((s, i) => `${AREA_GRADIENT_PREFIX}-${s.dataKey}-${i}`),
    [series]
  )

  const axisLabelProps = useCallback(
    (labelText: string | undefined, side: 'left' | 'right') => {
      if (!labelText) return undefined
      if (side === 'left') {
        return {
          value: labelText,
          angle: -90,
          position: 'insideLeft' as const,
          offset: 12,
          fontSize: CHART_FONT.labelSize,
          fill: theme.tickFill,
        }
      }
      return {
        value: labelText,
        angle: 90,
        position: 'insideRight' as const,
        offset: 12,
        fontSize: CHART_FONT.labelSize,
        fill: theme.tickFill,
      }
    },
    [theme.tickFill]
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
      {(width, h) => (
        <RechartsComposedChart width={width} height={h} data={mutableData} margin={mergedMargin}>
          <defs>
            {series.map((s, i) => {
              if (s.kind !== 'area') return null
              const strokeColor = s.color ?? palette[i % palette.length]
              const gid = areaGradientIds[i] ?? `${AREA_GRADIENT_PREFIX}-fallback`
              return (
                <linearGradient key={gid} id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={fillOpacity} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.02} />
                </linearGradient>
              )
            })}
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
            yAxisId={hasRightAxis ? 'left' : undefined}
            tickFormatter={yFormatter}
            tick={{ fontSize: CHART_FONT.tickSize, fill: theme.tickFill }}
            stroke={theme.axisStroke}
            hide={yAxis?.hide}
            tickCount={yAxis?.tickCount}
            label={axisLabelProps(yAxis?.label, 'left')}
          />
          {hasRightAxis && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={rightYFormatter}
              tick={{ fontSize: CHART_FONT.tickSize, fill: theme.tickFill }}
              stroke={theme.axisStroke}
              hide={rightYAxis?.hide}
              tickCount={rightYAxis?.tickCount}
              label={axisLabelProps(rightYAxis?.label, 'right')}
            />
          )}

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

          {series.map((s, i) => {
            const strokeColor = s.color ?? palette[i % palette.length]
            const name = s.name
            const gradientId = areaGradientIds[i]
            const bindAxisId = hasRightAxis ? (s.yAxisId === 'right' ? 'right' : 'left') : undefined

            if (s.kind === 'bar') {
              return (
                <Bar
                  key={s.dataKey}
                  yAxisId={bindAxisId}
                  dataKey={s.dataKey}
                  name={name}
                  fill={strokeColor}
                  radius={[barRadius, barRadius, 0, 0]}
                  maxBarSize={barSize}
                  isAnimationActive={animate}
                  animationDuration={CHART_DEFAULTS.animationDuration}
                  animationEasing={CHART_DEFAULTS.animationEasing}
                />
              )
            }

            if (s.kind === 'line') {
              return (
                <Line
                  key={s.dataKey}
                  yAxisId={bindAxisId}
                  type={curved ? 'monotone' : 'linear'}
                  dataKey={s.dataKey}
                  name={name}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  dot={{ r: CHART_DEFAULTS.dotRadius }}
                  activeDot={{ r: CHART_DEFAULTS.activeDotRadius }}
                  isAnimationActive={animate}
                  animationDuration={CHART_DEFAULTS.animationDuration}
                  animationEasing={CHART_DEFAULTS.animationEasing}
                />
              )
            }

            return (
              <Area
                key={s.dataKey}
                yAxisId={bindAxisId}
                type={curved ? 'monotone' : 'linear'}
                dataKey={s.dataKey}
                name={name}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill={gradientId ? `url(#${gradientId})` : strokeColor}
                fillOpacity={gradientId ? 1 : fillOpacity}
                isAnimationActive={animate}
                animationDuration={CHART_DEFAULTS.animationDuration}
                animationEasing={CHART_DEFAULTS.animationEasing}
              />
            )
          })}

          {brush?.enabled && (
            <Brush
              dataKey={xAxisKey}
              height={brush.height ?? CHART_DEFAULTS.brushHeight}
              stroke={theme.axisStroke}
              startIndex={brush.defaultRange?.[0]}
              endIndex={brush.defaultRange?.[1]}
            />
          )}
        </RechartsComposedChart>
      )}
    </ChartWrapper>
  )
}
