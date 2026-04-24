import { Fragment, useMemo } from 'react'
import {
  Brush,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CartesianLabelListEntry, PolarLabelListEntry } from 'recharts/types/component/LabelList'

import { ChartLegend } from '../ChartLegend'
import { ChartTooltip } from '../ChartTooltip'
import { ChartWrapper } from '../ChartWrapper'
import { CHART_DEFAULTS, CHART_FONT, CHART_MARGINS, CHART_PALETTE } from '../constants'
import type { MultiLineChartProps, SeriesConfig } from '../types'
import {
  enrichMultiLineDataWithForecast,
  forecastFcKey,
  forecastHistKey,
  seriesUsesForecastSplit,
} from '../utils/buildMultiLineForecastData'
import { useChartTheme } from '../utils/chartTheme'
import { defaultAxisFormatter, formatCompactNumber } from '../utils/formatters'

function lineLabelValueAccessor(
  rowDataKey: string,
  seriesName: string,
  pointLabelFormatter: (value: number, seriesName: string, index: number) => string,
  skipIndex?: number
): (entry: CartesianLabelListEntry | PolarLabelListEntry, index: number) => string | undefined {
  return (entry, index) => {
    if (skipIndex !== undefined && index === skipIndex) {
      return undefined
    }
    const row = entry as CartesianLabelListEntry
    const raw = row.value ?? row.payload?.[rowDataKey]
    const n = typeof raw === 'number' ? raw : Number(raw)
    if (!Number.isFinite(n)) {
      return undefined
    }
    return pointLabelFormatter(n, seriesName, index)
  }
}

function renderForecastPair(params: {
  readonly s: SeriesConfig
  readonly strokeColor: string
  readonly curved: boolean
  readonly effectiveShowDots: boolean
  readonly strokeWidth: number
  readonly animate: boolean
  readonly split: number
  readonly dash: string
  readonly showPointLabels: boolean
  readonly pointLabelFormatter: (value: number, seriesName: string, index: number) => string
  readonly themeText: string
}) {
  const {
    s,
    strokeColor,
    curved,
    effectiveShowDots,
    strokeWidth,
    animate,
    split,
    dash,
    showPointLabels,
    pointLabelFormatter,
    themeText,
  } = params

  const hKey = forecastHistKey(s.dataKey)
  const fKey = forecastFcKey(s.dataKey)

  return (
    <Fragment key={s.dataKey}>
      <Line
        type={curved ? 'monotone' : 'linear'}
        dataKey={hKey}
        name={s.name}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        dot={effectiveShowDots ? { r: CHART_DEFAULTS.dotRadius } : false}
        activeDot={{ r: CHART_DEFAULTS.activeDotRadius }}
        isAnimationActive={animate}
        animationDuration={CHART_DEFAULTS.animationDuration}
        animationEasing={CHART_DEFAULTS.animationEasing}
        connectNulls={false}
      >
        {showPointLabels && (
          <LabelList
            position="top"
            offset={6}
            fill={themeText}
            fontSize={CHART_FONT.tickSize}
            valueAccessor={lineLabelValueAccessor(hKey, s.name, pointLabelFormatter)}
          />
        )}
      </Line>
      <Line
        type={curved ? 'monotone' : 'linear'}
        dataKey={fKey}
        name={s.name}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        dot={effectiveShowDots ? { r: CHART_DEFAULTS.dotRadius } : false}
        activeDot={{ r: CHART_DEFAULTS.activeDotRadius }}
        isAnimationActive={animate}
        animationDuration={CHART_DEFAULTS.animationDuration}
        animationEasing={CHART_DEFAULTS.animationEasing}
        connectNulls
        legendType="none"
      >
        {showPointLabels && split > 0 && (
          <LabelList
            position="top"
            offset={6}
            fill={themeText}
            fontSize={CHART_FONT.tickSize}
            valueAccessor={lineLabelValueAccessor(fKey, s.name, pointLabelFormatter, split - 1)}
          />
        )}
      </Line>
    </Fragment>
  )
}

export function DPMultiLineChart({
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
  curved = true,
  showDots,
  strokeWidth = CHART_DEFAULTS.strokeWidth,
  showPointLabels = false,
  pointLabelFormatter = (v, _name, _i) => formatCompactNumber(v),
}: MultiLineChartProps) {
  const theme = useChartTheme()
  const palette = colors ?? CHART_PALETTE
  const xFormatter = xAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v, xAxis?.maxTickChars))
  const yFormatter = yAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v))

  const chartData = useMemo(() => enrichMultiLineDataWithForecast(data, series), [data, series])
  const effectiveShowDots = showDots ?? data.length <= 20

  const mergedMargin = useMemo(() => {
    const base = { ...CHART_MARGINS, ...margin }
    if (!showPointLabels) return base
    return { ...base, top: Math.max(base.top ?? CHART_MARGINS.top, 32) }
  }, [margin, showPointLabels])

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
        <RechartsLineChart width={width} height={h} data={chartData} margin={mergedMargin}>
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
            interval={xAxis?.interval}
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

          {series.map((s, i) => {
            const strokeColor = s.color ?? palette[i % palette.length]
            if (seriesUsesForecastSplit(s)) {
              const split = s.forecastFromIndex ?? 0
              const dash = s.forecastStrokeDasharray ?? '4 4'
              return renderForecastPair({
                s,
                strokeColor,
                curved,
                effectiveShowDots,
                strokeWidth,
                animate,
                split,
                dash,
                showPointLabels,
                pointLabelFormatter,
                themeText: theme.textColor,
              })
            }

            return (
              <Line
                key={s.dataKey}
                type={curved ? 'monotone' : 'linear'}
                dataKey={s.dataKey}
                name={s.name}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                dot={effectiveShowDots ? { r: CHART_DEFAULTS.dotRadius } : false}
                activeDot={{ r: CHART_DEFAULTS.activeDotRadius }}
                isAnimationActive={animate}
                animationDuration={CHART_DEFAULTS.animationDuration}
                animationEasing={CHART_DEFAULTS.animationEasing}
              >
                {showPointLabels && (
                  <LabelList
                    position="top"
                    offset={6}
                    fill={theme.textColor}
                    fontSize={CHART_FONT.tickSize}
                    valueAccessor={lineLabelValueAccessor(s.dataKey, s.name, pointLabelFormatter)}
                  />
                )}
              </Line>
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
        </RechartsLineChart>
      )}
    </ChartWrapper>
  )
}
