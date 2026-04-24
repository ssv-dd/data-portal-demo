import { useMemo } from 'react'
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CartesianLabelListEntry, PolarLabelListEntry } from 'recharts/types/component/LabelList'

import { ChartLegend } from '../ChartLegend'
import { ChartTooltip } from '../ChartTooltip'
import { ChartWrapper } from '../ChartWrapper'
import { CHART_DEFAULTS, CHART_FONT, CHART_MARGINS, CHART_PALETTE } from '../constants'
import type { HorizontalBarChartProps } from '../types'
import { useChartTheme } from '../utils/chartTheme'
import { defaultAxisFormatter, formatCompactNumber } from '../utils/formatters'

const DEFAULT_CATEGORY_AXIS_WIDTH = 200
const DEFAULT_HORIZONTAL_BAR_SIZE = 28

function barEndLabelAccessor(
  valueKey: string,
  barLabelFormatter: (value: number) => string
): (entry: CartesianLabelListEntry | PolarLabelListEntry, _index: number) => string | undefined {
  return (entry) => {
    const row = entry as CartesianLabelListEntry
    const raw = row.value ?? row.payload?.[valueKey]
    const n = typeof raw === 'number' ? raw : Number(raw)
    if (!Number.isFinite(n)) {
      return undefined
    }
    return barLabelFormatter(n)
  }
}

export function DPHorizontalBarChart({
  data,
  categoryKey,
  valueKey,
  height = CHART_DEFAULTS.height,
  className,
  style,
  animate = true,
  responsive = true,
  xAxis,
  yAxis,
  showGrid = false,
  gridDashed = true,
  legend,
  tooltip,
  colors,
  margin,
  loading,
  error,
  emptyMessage,
  categoryAxisWidth = DEFAULT_CATEGORY_AXIS_WIDTH,
  barSize = DEFAULT_HORIZONTAL_BAR_SIZE,
  barRadius = CHART_DEFAULTS.barRadius,
  showBarLabels = false,
  barLabelFormatter = (v) => formatCompactNumber(v),
}: HorizontalBarChartProps) {
  const theme = useChartTheme()
  const palette = colors ?? CHART_PALETTE
  const fill = palette[0] ?? CHART_PALETTE[0]
  const xFormatter = xAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v))
  const yFormatter = yAxis?.formatter ?? ((v: unknown) => defaultAxisFormatter(v, yAxis?.maxTickChars ?? 24))

  const mutableData = useMemo(() => [...data], [data])
  const mergedMargin = useMemo(() => ({ ...CHART_MARGINS, ...margin }), [margin])

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
        <RechartsBarChart layout="vertical" width={width} height={h} data={mutableData} margin={mergedMargin}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray={gridDashed ? '3 3' : undefined}
              stroke={theme.gridStroke}
              horizontal={false}
            />
          )}

          <XAxis
            type="number"
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
          />
          <YAxis
            type="category"
            dataKey={categoryKey}
            width={categoryAxisWidth}
            tickFormatter={yFormatter}
            tick={{ fontSize: CHART_FONT.tickSize, fill: theme.tickFill }}
            stroke={theme.axisStroke}
            interval={yAxis?.interval}
            hide={yAxis?.hide}
          />

          <Tooltip
            content={<ChartTooltip config={tooltip} />}
            cursor={{ fill: 'rgb(var(--app-muted-rgb) / 0.12)' }}
          />

          {!legend?.hide && (
            <Legend
              content={<ChartLegend position={legend?.position} />}
              verticalAlign={legend?.position === 'top' ? 'top' : 'bottom'}
            />
          )}

          <Bar
            dataKey={valueKey}
            name={tooltip?.yLabel ?? xAxis?.label ?? valueKey}
            fill={fill}
            radius={[0, barRadius, barRadius, 0]}
            maxBarSize={barSize}
            isAnimationActive={animate}
            animationDuration={CHART_DEFAULTS.animationDuration}
            animationEasing={CHART_DEFAULTS.animationEasing}
          >
            {showBarLabels && (
              <LabelList
                position="right"
                offset={6}
                fill={theme.textColor}
                fontSize={CHART_FONT.tickSize}
                valueAccessor={barEndLabelAccessor(valueKey, barLabelFormatter)}
              />
            )}
          </Bar>
        </RechartsBarChart>
      )}
    </ChartWrapper>
  )
}
