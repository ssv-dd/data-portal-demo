import type { CSSProperties, ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

/** Generic data row — keys map to axis/series fields. */
export type DataPoint = Record<string, string | number | null | undefined>

/** Named series descriptor for multi-series charts (stacked bar, multi-line). */
export interface SeriesConfig {
  /** Key in each DataPoint that holds this series' value. */
  readonly dataKey: string
  /** Human-readable label shown in legend/tooltip. */
  readonly name: string
  /** Override color for this series. Falls back to the palette. */
  readonly color?: string
  /**
   * **`DPMultiLineChart` only:** first **0-based row index** where the “forecast” segment starts
   * (dashed stroke). Earlier rows render as a solid line; the pivot month is duplicated so the
   * polyline stays visually continuous. Omit for a single solid/dashed style for the whole series.
   */
  readonly forecastFromIndex?: number
  /** Dash pattern for the forecast segment. Default: `4 4`. */
  readonly forecastStrokeDasharray?: string
}

// ---------------------------------------------------------------------------
// Axis
// ---------------------------------------------------------------------------

export interface AxisConfig {
  /** Label rendered alongside the axis. */
  readonly label?: string
  /** Format tick values for display. */
  readonly formatter?: (value: unknown) => string
  /** Maximum characters before a tick label is truncated. */
  readonly maxTickChars?: number
  /** Explicit tick count hint. */
  readonly tickCount?: number
  /**
   * Tick display stride (Recharts `interval`). E.g. `1` shows every other category tick.
   * Useful for dense monthly axes.
   */
  readonly interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd'
  /** Hide the axis line and ticks entirely. */
  readonly hide?: boolean
}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

export interface TooltipConfig {
  /** Format the displayed value. Receives the raw number and series name. */
  readonly valueFormatter?: (value: number, seriesName: string) => string
  /** Format the label row (usually the x-axis category). */
  readonly labelFormatter?: (label: string) => string
  /** Fully custom tooltip content. */
  readonly content?: ReactNode
  /** Label for the x-axis dimension shown in the tooltip header (e.g. "Date", "Region"). */
  readonly xLabel?: string
  /** Label for the y-axis metric shown in the tooltip row (e.g. "Revenue", "Orders"). */
  readonly yLabel?: string
}

// ---------------------------------------------------------------------------
// Legend
// ---------------------------------------------------------------------------

export type LegendPosition = 'top' | 'bottom' | 'left' | 'right'

export interface LegendConfig {
  readonly position?: LegendPosition
  readonly hide?: boolean
}

// ---------------------------------------------------------------------------
// Brush / Zoom
// ---------------------------------------------------------------------------

export interface BrushConfig {
  /** Enable the brush slider. Default: false. */
  readonly enabled?: boolean
  /** Height of the brush area in px. */
  readonly height?: number
  /** Initial visible data window [startIndex, endIndex]. */
  readonly defaultRange?: readonly [number, number]
}

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

export interface ChartStateProps {
  readonly loading?: boolean
  readonly error?: string | null
  readonly emptyMessage?: string
}

// ---------------------------------------------------------------------------
// Base props shared by all cartesian charts
// ---------------------------------------------------------------------------

export interface BaseChartProps extends ChartStateProps {
  /** The data array — each entry is one category / x-axis tick. */
  readonly data: readonly DataPoint[]
  /** Key in each DataPoint used for the x-axis. */
  readonly xAxisKey: string

  /** Explicit pixel height. Defaults to 400. */
  readonly height?: number
  /** Extra className on the outermost wrapper. */
  readonly className?: string
  /** Extra inline styles on the outermost wrapper. */
  readonly style?: CSSProperties

  /** Enable entry animations. Default: true. */
  readonly animate?: boolean
  /** Responsive: auto-fill available width. Default: true. */
  readonly responsive?: boolean

  /** X-axis configuration. */
  readonly xAxis?: AxisConfig
  /** Y-axis configuration. */
  readonly yAxis?: AxisConfig

  /** Grid lines. Default: true. */
  readonly showGrid?: boolean
  /** Use dashed grid lines. Default: true. */
  readonly gridDashed?: boolean

  /** Legend configuration. */
  readonly legend?: LegendConfig
  /** Tooltip configuration. */
  readonly tooltip?: TooltipConfig

  /** Override the default color palette. */
  readonly colors?: readonly string[]

  /** Brush / zoom slider. */
  readonly brush?: BrushConfig

  /** Margins around the chart content area. */
  readonly margin?: {
    readonly top?: number
    readonly right?: number
    readonly bottom?: number
    readonly left?: number
  }
}

// ---------------------------------------------------------------------------
// Chart-specific props
// ---------------------------------------------------------------------------

export interface BarChartProps extends BaseChartProps {
  readonly yAxisKey: string
  /** Top-corner radius on bars. Default: 4. */
  readonly barRadius?: number
  /** Max bar width in px. */
  readonly barSize?: number
}

/** Horizontal bar chart — category on Y, numeric extent on X (Recharts `layout="vertical"`). */
export interface HorizontalBarChartProps extends ChartStateProps {
  readonly data: readonly DataPoint[]
  /** Field for row label (Y-axis categories). */
  readonly categoryKey: string
  /** Field for bar length (X-axis numeric values). */
  readonly valueKey: string
  readonly height?: number
  readonly className?: string
  readonly style?: CSSProperties
  readonly animate?: boolean
  readonly responsive?: boolean
  /** Numeric axis (bottom). */
  readonly xAxis?: AxisConfig
  /** Category axis (left); increase width for long labels. */
  readonly yAxis?: AxisConfig
  readonly showGrid?: boolean
  readonly gridDashed?: boolean
  readonly legend?: LegendConfig
  readonly tooltip?: TooltipConfig
  readonly colors?: readonly string[]
  readonly margin?: BaseChartProps['margin']
  /** Pixel width reserved for Y-axis category labels. Default: 200. */
  readonly categoryAxisWidth?: number
  /** Max bar thickness (height of each bar). Default: 28. */
  readonly barSize?: number
  /** Radius on the outer (right) end of each bar. Default: 4. */
  readonly barRadius?: number
  /** Show value at the end of each bar (e.g. `8.12M`). */
  readonly showBarLabels?: boolean
  readonly barLabelFormatter?: (value: number) => string
}

export interface StackedBarChartProps extends BaseChartProps {
  readonly series: readonly SeriesConfig[]
  readonly barRadius?: number
  readonly barSize?: number
  /** 'stacked' (absolute), 'percent' (100%), or 'grouped' (side-by-side). Default: 'stacked'. */
  readonly stackMode?: 'stacked' | 'percent' | 'grouped'
}

export interface AreaChartProps extends BaseChartProps {
  readonly yAxisKey: string
  /** Smooth curve interpolation. Default: true. */
  readonly curved?: boolean
  /** Fill opacity under the curve. Default: 0.15. */
  readonly fillOpacity?: number
  /** Line stroke width. Default: 2. */
  readonly strokeWidth?: number
}

export interface LineChartProps extends BaseChartProps {
  readonly yAxisKey: string
  /** Smooth curve interpolation. Default: true. */
  readonly curved?: boolean
  /** Show data point dots. Default: false for >20 points. */
  readonly showDots?: boolean
  /** Line stroke width. Default: 2. */
  readonly strokeWidth?: number
}

export interface MultiLineChartProps extends BaseChartProps {
  readonly series: readonly SeriesConfig[]
  /** Smooth curve interpolation. Default: true. */
  readonly curved?: boolean
  /** Show data point dots. Default: false for >20 points. */
  readonly showDots?: boolean
  /** Line stroke width. Default: 2. */
  readonly strokeWidth?: number
  /** Render a numeric label above each vertex (e.g. compact millions). */
  readonly showPointLabels?: boolean
  /**
   * Formats point labels when `showPointLabels` is true.
   * Default: compact number (`formatCompactNumber`).
   */
  readonly pointLabelFormatter?: (value: number, seriesName: string, index: number) => string
}

// Radial charts have a simpler data model
export interface RadialDataPoint {
  readonly name: string
  readonly value: number
}

export interface PieChartProps extends ChartStateProps {
  readonly data: readonly RadialDataPoint[]
  readonly height?: number
  readonly className?: string
  readonly style?: CSSProperties
  readonly animate?: boolean
  readonly responsive?: boolean
  readonly colors?: readonly string[]
  readonly showLabels?: boolean
  readonly legend?: LegendConfig
  readonly tooltip?: TooltipConfig
  /** Percentage label inside or outside. Default: 'outside'. */
  readonly labelPosition?: 'inside' | 'outside'
  /** Outside label: append formatted absolute value, e.g. millions (`37.54M`). */
  readonly labelValueFormatter?: (value: number) => string
  /**
   * Outside label: hide when slice share is below this (0–1). Use `0` to always show tiny slices.
   * Default: `0.03`.
   */
  readonly labelMinPercent?: number
  /** Truncate category name in outside labels. Default: 22. */
  readonly labelNameMaxChars?: number
}

export interface DonutChartProps extends PieChartProps {
  /** Donut hole radius as fraction of outer radius (0–1). Default: 0.55. */
  readonly innerRadiusRatio?: number
  /** Content rendered in the center hole. */
  readonly centerContent?: ReactNode
}

// ---------------------------------------------------------------------------
// Composed (combo) chart
// ---------------------------------------------------------------------------

export type ComposedSeriesKind = 'bar' | 'line' | 'area'

export interface ComposedSeriesConfig extends SeriesConfig {
  readonly kind: ComposedSeriesKind
  /**
   * Dual Y-axis: bind this series to the **right** scale (e.g. margin %). Omit or `'left'` for the
   * primary scale (e.g. revenue). Requires a matching `rightYAxis` config when any series uses `'right'`.
   */
  readonly yAxisId?: 'left' | 'right'
}

export interface ComposedChartProps extends BaseChartProps {
  readonly series: readonly ComposedSeriesConfig[]
  readonly barRadius?: number
  readonly barSize?: number
  readonly curved?: boolean
  readonly strokeWidth?: number
  readonly fillOpacity?: number
  /** Secondary Y-axis (right). Use when any series sets `yAxisId: 'right'` (e.g. % vs currency). */
  readonly rightYAxis?: AxisConfig
}

// ---------------------------------------------------------------------------
// Scatter chart
// ---------------------------------------------------------------------------

export interface ScatterSeriesConfig {
  readonly name: string
  readonly yDataKey: string
  readonly color?: string
  /** When set, point radius is scaled from this numeric column (bubble chart). */
  readonly zDataKey?: string
}

export interface ScatterChartProps extends BaseChartProps {
  /** Each series shares `xAxisKey` for the X dimension and uses its own `yDataKey`. */
  readonly series: readonly ScatterSeriesConfig[]
  readonly xAxisType?: 'number' | 'category'
  readonly yAxisType?: 'number' | 'category'
  /** Pixel range mapped from `zDataKey` (first series that defines `zDataKey` wins). Default: [24, 200]. */
  readonly zRange?: readonly [number, number]
}

// ---------------------------------------------------------------------------
// Funnel chart
// ---------------------------------------------------------------------------

export interface FunnelChartProps extends ChartStateProps {
  readonly data: readonly RadialDataPoint[]
  readonly height?: number
  readonly className?: string
  readonly style?: CSSProperties
  readonly animate?: boolean
  readonly responsive?: boolean
  readonly colors?: readonly string[]
  readonly legend?: LegendConfig
  readonly tooltip?: TooltipConfig
  /** Reversed funnel order (narrowest first). Default: false. */
  readonly reversed?: boolean
  readonly margin?: BaseChartProps['margin']
}

// ---------------------------------------------------------------------------
// Sankey chart
// ---------------------------------------------------------------------------

export interface SankeyLinkDatum {
  readonly source: number
  readonly target: number
  readonly value: number
}

export interface SankeyChartData {
  readonly nodes: readonly DataPoint[]
  readonly links: readonly SankeyLinkDatum[]
}

export interface SankeyChartProps extends ChartStateProps {
  readonly data: SankeyChartData
  readonly height?: number
  readonly className?: string
  readonly style?: CSSProperties
  readonly responsive?: boolean
  readonly colors?: readonly string[]
  readonly tooltip?: TooltipConfig
  readonly margin?: BaseChartProps['margin']
  readonly nodeWidth?: number
  readonly nodePadding?: number
  readonly linkCurvature?: number
}

// ---------------------------------------------------------------------------
// Gauge (radial progress)
// ---------------------------------------------------------------------------

export interface GaugeChartProps extends ChartStateProps {
  /** Current value (clamped to `[min, max]`). */
  readonly value: number
  readonly min?: number
  readonly max?: number
  readonly height?: number
  readonly className?: string
  readonly style?: CSSProperties
  readonly animate?: boolean
  readonly responsive?: boolean
  /** Fill for the progress segment. */
  readonly fill?: string
  /** Track color behind the progress segment. */
  readonly trackColor?: string
  readonly tooltip?: TooltipConfig
  /** Label shown under the centered value (e.g. metric name). */
  readonly label?: string
  readonly formatValue?: (value: number) => string
  /** Sweep angles in degrees (polar convention). Defaults to a ~240° arc opening downward. */
  readonly startAngle?: number
  readonly endAngle?: number
  readonly innerRadius?: string | number
  readonly outerRadius?: string | number
}

// ---------------------------------------------------------------------------
// KPI tile (not a Recharts chart — paired with the chart library for widgets)
// ---------------------------------------------------------------------------

export type KpiDeltaTrend = 'up' | 'down' | 'neutral'

export interface KpiDelta {
  readonly value: number
  /** Optional secondary label (e.g. "vs last week"). */
  readonly label?: string
  /** Visual emphasis for positive / negative / flat movement. */
  readonly trend?: KpiDeltaTrend
}

/** One column in `columns` compare layout (e.g. current year vs prior year). */
export interface KpiColumn {
  readonly label: string
  readonly value: string | number | null | undefined
  readonly formatValue?: (value: number) => string
}

export interface KpiProps extends ChartStateProps {
  /** Card title. In compare mode (`columns`), shown as a header above the divider. */
  readonly title: string
  /**
   * Single-metric mode: primary value (omit when using `columns`).
   * Compare mode: pass `columns` instead; each column has its own `value` + optional `formatValue`.
   */
  readonly value?: string | number | null | undefined
  readonly formatValue?: (value: number) => string
  readonly subtitle?: string
  readonly delta?: KpiDelta
  /**
   * When set (non-empty), renders a comparison card: title + divider + equal-width columns
   * with large figures (e.g. YTD vs YTD). Use `formatValue` per column for `61.335M`-style strings.
   */
  readonly columns?: readonly KpiColumn[]
  readonly height?: number
  readonly className?: string
  readonly style?: CSSProperties
  readonly onRetry?: () => void
  /** Single-metric mode only: use a larger figure style (still smaller than `columns` values). */
  readonly emphasizeValue?: boolean
}
