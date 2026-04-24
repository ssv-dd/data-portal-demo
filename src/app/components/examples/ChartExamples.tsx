/**
 * Example usage of the Data Portal chart components.
 *
 * Each section below demonstrates a chart type with realistic data,
 * showing both minimal and fully-configured variants.
 * Copy-paste any snippet into a feature page to get started.
 */

import {
  type SankeyChartData,
  DPAreaChart,
  DPBarChart,
  DPComposedChart,
  DPDonutChart,
  DPFunnelChart,
  DPGaugeChart,
  DPHorizontalBarChart,
  DPKPI,
  DPLineChart,
  DPMultiLineChart,
  DPPieChart,
  DPScatterChart,
  DPSankeyChart,
  DPStackedBarChart,
  formatCompactNumber,
  formatScaledSuffix,
} from '../charts'

// ---------------------------------------------------------------------------
// Sample data generators
// ---------------------------------------------------------------------------

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const revenueByMonth = months.map((m, i) => ({
  month: m,
  revenue: 12000 + Math.round(Math.sin(i * 0.8) * 4000 + Math.random() * 2000),
}))

const regionRevenue = months.map((m, i) => ({
  month: m,
  northAmerica: 5000 + Math.round(Math.random() * 3000 + i * 200),
  europe: 3000 + Math.round(Math.random() * 2500 + i * 150),
  apac: 2000 + Math.round(Math.random() * 2000 + i * 100),
}))

const verticals = [
  { name: 'Restaurant', value: 42000 },
  { name: 'Grocery', value: 28000 },
  { name: 'Convenience', value: 18000 },
  { name: 'Alcohol', value: 9500 },
  { name: 'Pet Supplies', value: 4200 },
  { name: 'Flowers', value: 2800 },
]

/** Snowflake-style cost mix (donut callout demo). */
const snowflakeCostByService = [
  { name: 'compute', value: 37.54e6 },
  { name: 'wolt', value: 9.58e6 },
  { name: 'storage', value: 9.34e6 },
  { name: 'snowpipe', value: 1.62e6 },
  { name: 'reclustering', value: 1.37e6 },
  { name: 'Unknown', value: 21.78 },
]

const snowflakeCostByServiceColors = [
  'var(--app-yellow-600)',
  'var(--app-blue-600)',
  'var(--app-slate-500)',
  'var(--app-cyan-400)',
  'var(--app-emerald-400)',
  'var(--app-green-600)',
] as const

function formatSnowflakeDonutValue(v: number): string {
  if (Math.abs(v) >= 1_000_000) {
    return formatScaledSuffix(v, 1_000_000, 'M', 2)
  }
  if (Math.abs(v) >= 1_000) {
    return formatScaledSuffix(v, 1_000, 'K', 2)
  }
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const dailyOrders = Array.from({ length: 30 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  orders: 800 + Math.round(Math.sin(i * 0.4) * 200 + Math.random() * 100),
}))

/** Snowflake-style portfolio rows (unsorted); example sorts descending by cost. */
const snowflakePortfolioRows = [
  { portfolio: 'etl managed - de (excludes ad…)', cost: 8.12e6 },
  { portfolio: 'product engineering', cost: 5.4e6 },
  { portfolio: 'etl unmanaged - unassigned d…', cost: 4.95e6 },
  { portfolio: 'data platform - ingestion', cost: 3.1e6 },
  { portfolio: 'analytics', cost: 2.75e6 },
  { portfolio: 'bi - sigma', cost: 2.2e6 },
  { portfolio: 'experimentation', cost: 1.85e6 },
  { portfolio: 'ads-de', cost: 1.62e6 },
  { portfolio: 'bi - mode', cost: 1.41e6 },
  { portfolio: 'data platform - retention', cost: 1.12e6 },
  { portfolio: 'data platform - pii/governance', cost: 980_000 },
  { portfolio: 'data platform - services', cost: 842_000 },
  { portfolio: 'data platform - curator', cost: 610_000 },
  { portfolio: 'ml', cost: 504_000 },
  { portfolio: 'bi - tableau', cost: 428_000 },
  { portfolio: 'data platform - dq/frameworks', cost: 312_000 },
  { portfolio: 'data platform - ai', cost: 228_000 },
  { portfolio: 'other', cost: 45_200 },
  { portfolio: 'bi - other', cost: 1_310 },
]

const snowflakePortfolioByCost = [...snowflakePortfolioRows].sort((a, b) => b.cost - a.cost)

const multiMetrics = Array.from({ length: 24 }, (_, i) => ({
  week: `W${i + 1}`,
  sessions: 4200 + Math.round(Math.sin(i * 0.5) * 1200 + Math.random() * 600 + i * 80),
  conversions: 2800 + Math.round(Math.cos(i * 0.4) * 900 + Math.random() * 500 + i * 60),
  signups: 1500 + Math.round(Math.sin(i * 0.7 + 1) * 700 + Math.random() * 400 + i * 40),
}))

/** Sample 2026 budget curve (in dollars) — inspired by planned vs actual vs outlook dashboards. */
const MILLION = 1_000_000
const databricksBudget2026 = [
  { month: 'Jan', actual: 4.5 * MILLION, planned: 4.5 * MILLION, projected: 4.47 * MILLION },
  { month: 'Feb', actual: 3.71 * MILLION, planned: 4.09 * MILLION, projected: 4.33 * MILLION },
  { month: 'Mar', actual: 4.7 * MILLION, planned: 4.69 * MILLION, projected: 5.04 * MILLION },
  { month: 'Apr', actual: 3.19 * MILLION, planned: 4.63 * MILLION, projected: 5.11 * MILLION },
  { month: 'May', actual: 3.45 * MILLION, planned: 4.57 * MILLION, projected: 5.53 * MILLION },
  { month: 'Jun', actual: 3.62 * MILLION, planned: 4.72 * MILLION, projected: 5.59 * MILLION },
  { month: 'Jul', actual: 3.78 * MILLION, planned: 4.57 * MILLION, projected: 6.02 * MILLION },
  { month: 'Aug', actual: 3.95 * MILLION, planned: 4.81 * MILLION, projected: 6.27 * MILLION },
  { month: 'Sep', actual: 4.1 * MILLION, planned: 4.81 * MILLION, projected: 6.31 * MILLION },
  { month: 'Oct', actual: 3.98 * MILLION, planned: 4.66 * MILLION, projected: 6.77 * MILLION },
  { month: 'Nov', actual: 4.22 * MILLION, planned: 4.97 * MILLION, projected: 6.79 * MILLION },
  { month: 'Dec', actual: 4.35 * MILLION, planned: 4.81 * MILLION, projected: 7.26 * MILLION },
]

/**
 * Monthly revenue ($) and gross margin % for composed chart — deterministic, dual-axis friendly.
 * Margin dips slightly mid-year (promo / capacity narrative) while revenue follows a seasonal curve.
 */
const comboByMonth = months.map((m, i) => {
  const revenue = Math.round(10_500 + Math.sin((i - 1.5) * 0.55) * 4_200 + i * 340 + (i % 4) * 180)
  const marginPct = Number((24.2 - Math.sin(i * 0.5) * 3.8 + (i >= 4 && i <= 8 ? -2.2 : 0.4)).toFixed(1))
  return { month: m, revenue, marginPct }
})

/**
 * Synthetic “noisy production” samples: **higher throughput → higher P95** (queueing / saturation),
 * with bubble size ∝ concurrent sessions. Deterministic (no `Math.random`) so the demo is stable.
 */
const scatterLatency = Array.from({ length: 48 }, (_, i) => {
  const throughput = Math.round(
    175 + i * 6.8 + (i % 7) * 4 + Math.sin(i * 0.55) * 14 + Math.cos(i * 0.31) * 10
  )
  const load = Math.min(1.15, Math.max(0, (throughput - 165) / 340))
  const latency = Math.round(
    46 + load * 72 + load * load * 48 + Math.sin(i * 1.4) * 9 + Math.cos(i * 0.76) * 7
  )
  const sessions = Math.round(
    680 + load * 2_350 + (i % 6) * 110 + Math.sin(i * 2.08) * 220 + Math.cos(i * 1.1) * 140
  )
  return {
    throughput,
    latency: Math.min(168, Math.max(40, latency)),
    sessions: Math.min(5_200, Math.max(420, sessions)),
  }
})

const funnelStages = [
  { name: 'Sessions', value: 52000 },
  { name: 'Product views', value: 31000 },
  { name: 'Add to cart', value: 14200 },
  { name: 'Checkout', value: 6100 },
  { name: 'Purchase', value: 2840 },
]

/**
 * Acquisition → signup → outcome. **Imbalanced inflows** (paid ≫ organic ≫ partner) and a realistic
 * split where most signups **drop before first purchase** — link widths vary clearly in the diagram.
 */
const sankeyDemo = {
  nodes: [
    { name: 'Paid ads' },
    { name: 'Organic search' },
    { name: 'Partner referrals' },
    { name: 'Signup / intent' },
    { name: 'First purchase' },
    { name: 'Dropped before pay' },
  ],
  links: [
    { source: 0, target: 3, value: 8_600 },
    { source: 1, target: 3, value: 2_900 },
    { source: 2, target: 3, value: 1_100 },
    { source: 3, target: 4, value: 4_750 },
    { source: 3, target: 5, value: 7_850 },
  ],
} satisfies SankeyChartData

// ---------------------------------------------------------------------------
// Examples
// ---------------------------------------------------------------------------

/**
 * 1. Bar Chart — minimal usage
 */
export function BarChartExample() {
  return (
    <DPBarChart
      data={revenueByMonth}
      xAxisKey="month"
      yAxisKey="revenue"
      height={360}
      yAxis={{ label: 'Revenue ($)', formatter: (v: unknown) => `$${Number(v).toLocaleString()}` }}
      tooltip={{
        xLabel: 'Month',
        yLabel: 'Revenue',
        valueFormatter: (v: unknown) => `$${Number(v).toLocaleString()}`,
      }}
    />
  )
}

/**
 * 2. Bar Chart — with brush zoom
 */
export function BarChartWithBrushExample() {
  return (
    <DPBarChart
      data={dailyOrders}
      xAxisKey="day"
      yAxisKey="orders"
      height={420}
      brush={{ enabled: true }}
      tooltip={{
        xLabel: 'Day',
        yLabel: 'Orders',
        valueFormatter: (v: unknown) => `${Number(v).toLocaleString()} orders`,
      }}
      colors={['var(--app-cyan-400)']}
    />
  )
}

function formatSnowflakeBarEnd(v: number): string {
  if (Math.abs(v) >= 1_000_000) {
    return formatScaledSuffix(v, 1_000_000, 'M', 2)
  }
  if (Math.abs(v) >= 1_000) {
    return formatScaledSuffix(v, 1_000, 'K', 2)
  }
  return formatCompactNumber(v)
}

/**
 * 2b. Horizontal bar — cost by portfolio (ranked, end labels, millions on X)
 */
export function HorizontalBarSnowflakePortfolioExample() {
  return (
    <DPHorizontalBarChart
      data={snowflakePortfolioByCost}
      categoryKey="portfolio"
      valueKey="cost"
      height={520}
      colors={['var(--app-rose-500)']}
      showGrid={false}
      legend={{ hide: true }}
      categoryAxisWidth={220}
      barSize={22}
      margin={{ top: 8, right: 72, bottom: 28, left: 4 }}
      showBarLabels
      barLabelFormatter={formatSnowflakeBarEnd}
      xAxis={{
        label: 'Total cost',
        formatter: (v: unknown) => `${(Number(v) / 1_000_000).toFixed(0)}M`,
      }}
      yAxis={{ maxTickChars: 34 }}
      tooltip={{
        xLabel: 'Portfolio',
        yLabel: 'Total cost',
        valueFormatter: (v: number) => formatSnowflakeBarEnd(v),
      }}
    />
  )
}

/**
 * 3. Stacked Bar Chart — regional breakdown
 */
export function StackedBarChartExample() {
  return (
    <DPStackedBarChart
      data={regionRevenue}
      xAxisKey="month"
      series={[
        { dataKey: 'northAmerica', name: 'North America' },
        { dataKey: 'europe', name: 'Europe' },
        { dataKey: 'apac', name: 'APAC' },
      ]}
      height={400}
      yAxis={{ label: 'Revenue', formatter: (v: unknown) => `$${Number(v).toLocaleString()}` }}
      tooltip={{ xLabel: 'Month', valueFormatter: (v: unknown) => `$${Number(v).toLocaleString()}` }}
    />
  )
}

/**
 * 4. Stacked Bar Chart — 100% stacked
 */
export function StackedBarPercentExample() {
  return (
    <DPStackedBarChart
      data={regionRevenue}
      xAxisKey="month"
      series={[
        { dataKey: 'northAmerica', name: 'North America', color: 'var(--app-violet-500)' },
        { dataKey: 'europe', name: 'Europe', color: 'var(--app-emerald-500)' },
        { dataKey: 'apac', name: 'APAC', color: 'var(--app-cyan-400)' },
      ]}
      stackMode="percent"
      height={360}
    />
  )
}

/**
 * 5. Area Chart — daily orders trend
 */
export function AreaChartExample() {
  return (
    <DPAreaChart
      data={dailyOrders}
      xAxisKey="day"
      yAxisKey="orders"
      height={360}
      colors={['var(--app-emerald-500)']}
      fillOpacity={0.2}
      tooltip={{
        xLabel: 'Day',
        yLabel: 'Orders',
        valueFormatter: (v: unknown) => Number(v).toLocaleString(),
      }}
    />
  )
}

/**
 * 6. Line Chart — single series
 */
export function LineChartExample() {
  return (
    <DPLineChart
      data={revenueByMonth}
      xAxisKey="month"
      yAxisKey="revenue"
      height={360}
      yAxis={{ formatter: (v: unknown) => `$${Number(v).toLocaleString()}` }}
      tooltip={{
        xLabel: 'Month',
        yLabel: 'Revenue',
        valueFormatter: (v: unknown) => `$${Number(v).toLocaleString()}`,
      }}
      showDots
    />
  )
}

/**
 * 7. Multi-Line Chart — comparing multiple metrics
 */
export function MultiLineChartExample() {
  return (
    <DPMultiLineChart
      data={multiMetrics}
      xAxisKey="week"
      series={[
        { dataKey: 'sessions', name: 'Sessions' },
        { dataKey: 'conversions', name: 'Conversions' },
        { dataKey: 'signups', name: 'Signups' },
      ]}
      height={420}
      brush={{ enabled: true }}
      legend={{ position: 'top' }}
      tooltip={{ xLabel: 'Week', valueFormatter: (v: unknown) => Number(v).toLocaleString() }}
    />
  )
}

/**
 * 7b. Multi-line — planned vs actual vs outlook (solid history + dashed forecast + point labels)
 */
export function MultiLineForecastBudgetExample() {
  const fmtM2 = (v: number) => formatScaledSuffix(v, MILLION, 'M', 2)
  return (
    <DPMultiLineChart
      data={databricksBudget2026}
      xAxisKey="month"
      height={440}
      showGrid={false}
      margin={{ top: 8, right: 12, bottom: 28, left: 4 }}
      legend={{ position: 'top' }}
      showDots
      showPointLabels
      pointLabelFormatter={(v) => fmtM2(v)}
      xAxis={{
        label: 'Monthly date (for 2026)',
        interval: 1,
      }}
      yAxis={{
        label: 'Total cost',
        formatter: (v: unknown) => `${(Number(v) / MILLION).toFixed(0)}M`,
      }}
      series={[
        {
          name: 'Actual cost',
          dataKey: 'actual',
          color: 'var(--app-emerald-500)',
          forecastFromIndex: 3,
        },
        {
          name: 'Planned budget cost',
          dataKey: 'planned',
          color: 'var(--app-blue-600)',
          forecastFromIndex: 2,
        },
        {
          name: 'Projected cost',
          dataKey: 'projected',
          color: 'var(--app-rose-500)',
          forecastFromIndex: 3,
        },
      ]}
      tooltip={{
        xLabel: 'Month',
        yLabel: 'Amount',
        valueFormatter: (v: number) => fmtM2(v),
      }}
    />
  )
}

/**
 * 8. Pie Chart — vertical distribution
 */
export function PieChartExample() {
  return <DPPieChart data={verticals} height={400} showLabels />
}

/**
 * 9. Donut Chart — Snowflake-style breakdown (outside value + % callouts, custom colors)
 */
export function DonutChartExample() {
  return (
    <DPDonutChart
      data={snowflakeCostByService}
      height={460}
      colors={[...snowflakeCostByServiceColors]}
      legend={{ hide: true }}
      labelValueFormatter={formatSnowflakeDonutValue}
      labelMinPercent={0}
      labelNameMaxChars={20}
      tooltip={{
        xLabel: 'Category',
        yLabel: 'Cost',
        valueFormatter: (v: number) => formatSnowflakeDonutValue(v),
      }}
    />
  )
}

/**
 * 9b. Donut Chart — with center summary (compact KPI in the hole)
 */
export function DonutChartWithCenterSummaryExample() {
  const total = verticals.reduce((s, v) => s + v.value, 0)
  return (
    <DPDonutChart
      data={verticals}
      height={400}
      labelMinPercent={0.03}
      centerContent={
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--app-fg)' }}>
            ${(total / 1000).toFixed(0)}K
          </div>
          <div style={{ fontSize: 12, color: 'var(--app-muted-fg)' }}>Total revenue</div>
        </div>
      }
    />
  )
}

/**
 * 10. Composed (combo) chart — bars + line on shared categories, **dual Y-axis** (currency vs %).
 */
export function ComposedChartExample() {
  return (
    <DPComposedChart
      data={comboByMonth}
      xAxisKey="month"
      series={[
        { kind: 'bar', dataKey: 'revenue', name: 'Revenue' },
        { kind: 'line', dataKey: 'marginPct', name: 'Margin %', yAxisId: 'right' },
      ]}
      height={380}
      yAxis={{
        label: 'Revenue',
        formatter: (v: unknown) => formatCompactNumber(Number(v)),
      }}
      rightYAxis={{
        label: 'Margin %',
        formatter: (v: unknown) => `${Number(v).toFixed(0)}%`,
      }}
      tooltip={{
        xLabel: 'Month',
        valueFormatter: (v: number, name: string) =>
          name === 'Margin %' ? `${Number(v).toFixed(1)}%` : `$${Number(v).toLocaleString()}`,
      }}
    />
  )
}

/**
 * 11. Scatter chart — latency vs throughput (bubble size = sessions); load rises with throughput.
 */
export function ScatterChartExample() {
  return (
    <DPScatterChart
      data={scatterLatency}
      xAxisKey="throughput"
      series={[{ name: 'Observed', yDataKey: 'latency', zDataKey: 'sessions' }]}
      height={380}
      xAxis={{ label: 'Throughput (req/s)' }}
      yAxis={{ label: 'P95 latency (ms)' }}
      tooltip={{ xLabel: 'Throughput (req/s)', yLabel: 'P95 latency (ms)' }}
    />
  )
}

/**
 * 12. Funnel chart — stage conversion
 */
export function FunnelChartExample() {
  return (
    <DPFunnelChart
      data={funnelStages}
      height={360}
      legend={{ position: 'bottom' }}
      tooltip={{ xLabel: 'Stage', yLabel: 'Volume', valueFormatter: (v: number) => v.toLocaleString() }}
    />
  )
}

/**
 * 13. Sankey — three acquisition channels into signup, then purchase vs drop (conserved volumes).
 */
export function SankeyChartExample() {
  return (
    <DPSankeyChart
      data={sankeyDemo}
      height={400}
      tooltip={{ xLabel: 'Flow', yLabel: 'Volume', valueFormatter: (v: number) => v.toLocaleString() }}
    />
  )
}

/**
 * 14. Gauge — radial progress toward a target
 */
export function GaugeChartExample() {
  return (
    <DPGaugeChart
      value={72}
      max={100}
      height={320}
      label="Query SLA met"
      tooltip={{ yLabel: 'SLA', valueFormatter: (v: number) => `${v}%` }}
      formatValue={(v) => `${v}%`}
    />
  )
}

/**
 * 15. KPI tiles — headline metrics with optional delta
 */
export function KPIRowExample() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
      <DPKPI
        title="Gross bookings"
        value={128400}
        formatValue={(v) => `$${(v / 1000).toFixed(1)}K`}
        subtitle="Last 7 days"
        emphasizeValue
        delta={{ value: 6.2, label: 'vs prior week', trend: 'up' }}
      />
      <DPKPI
        title="Error rate"
        value={0.42}
        formatValue={(v) => `${v.toFixed(2)}%`}
        delta={{ value: -0.08, label: 'vs prior week', trend: 'down' }}
      />
    </div>
  )
}

/**
 * 15b. KPI — YTD compare card (large figures, two columns)
 */
export function KPIYtdCompareExample() {
  const ytd2026 = 61_335_000
  const ytd2025 = 49_337_000
  return (
    <DPKPI
      title="YTD Spend (Current Year V/s Past Year)"
      height={200}
      columns={[
        {
          label: '2026 YTD Spend',
          value: ytd2026,
          formatValue: (v) => formatScaledSuffix(v, 1_000_000, 'M', 3),
        },
        {
          label: '2025 YTD Spend',
          value: ytd2025,
          formatValue: (v) => formatScaledSuffix(v, 1_000_000, 'M', 3),
        },
      ]}
    />
  )
}

/**
 * 16. Loading state — works on any chart
 */
export function LoadingStateExample() {
  return <DPBarChart data={[]} xAxisKey="x" yAxisKey="y" loading height={300} />
}

/**
 * 17. Error state — works on any chart
 */
export function ErrorStateExample() {
  return (
    <DPBarChart
      data={[]}
      xAxisKey="x"
      yAxisKey="y"
      error="Failed to load chart data. Please check your query."
      height={300}
    />
  )
}

/**
 * 18. Empty state — works on any chart
 */
export function EmptyStateExample() {
  return (
    <DPLineChart
      data={[]}
      xAxisKey="x"
      yAxisKey="y"
      emptyMessage="No data matches the selected filters."
      height={300}
    />
  )
}
