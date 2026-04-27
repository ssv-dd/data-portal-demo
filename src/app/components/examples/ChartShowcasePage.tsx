import { BarChart3, Download, LineChart, PieChart, Share2 } from 'lucide-react'
import * as React from 'react'

import { ClickableCard } from '../ui/ClickableCard'
import { CustomDropdown, type CustomDropdownOption } from '../ui/CustomDropdown'
import { FilterDropdown, type FilterDropdownOption } from '../ui/FilterDropdown'
import { MenuDropdown, type MenuDropdownItem } from '../ui/MenuDropdown'
import { SurfaceCard } from '../ui/SurfaceCard'

import { AgGridShowcaseExample } from './AgGridShowcaseExample'
import {
  AreaChartExample,
  BarChartExample,
  BarChartWithBrushExample,
  ComposedChartExample,
  DonutChartExample,
  DonutChartWithCenterSummaryExample,
  EmptyStateExample,
  ErrorStateExample,
  FunnelChartExample,
  GaugeChartExample,
  HorizontalBarSnowflakePortfolioExample,
  KPIRowExample,
  KPIYtdCompareExample,
  LineChartExample,
  LoadingStateExample,
  MultiLineChartExample,
  MultiLineForecastBudgetExample,
  PieChartExample,
  SankeyChartExample,
  ScatterChartExample,
  StackedBarChartExample,
  StackedBarPercentExample,
} from './ChartExamples'
import * as S from './ChartShowcasePage.styles'
import { TabularMatrixAgGridExample } from './TabularMatrixAgGridExample'

const FILTER_DEMO_OPTIONS: readonly FilterDropdownOption[] = [
  { id: 'bar', label: 'Bar metrics', icon: BarChart3 },
  { id: 'line', label: 'Line metrics', icon: LineChart },
  { id: 'pie', label: 'Pie metrics', icon: PieChart },
]

const DONUT_SHOWCASE_OPTIONS: CustomDropdownOption[] = [
  { value: 'callouts', label: 'Cost mix callouts' },
  { value: 'center', label: 'Center summary' },
]

export function ChartShowcasePage() {
  const [clickCount, setClickCount] = React.useState(0)
  const [filterDemoValue, setFilterDemoValue] = React.useState('bar')
  const [customDemoValue, setCustomDemoValue] = React.useState('30d')
  const [menuDemoHint, setMenuDemoHint] = React.useState<string | null>(null)
  const [donutShowcaseVariant, setDonutShowcaseVariant] = React.useState('callouts')

  const customDemoOptions = React.useMemo((): CustomDropdownOption[] => {
    return [
      { value: '30d', label: 'Last 30 days' },
      { value: '7d', label: 'Last 7 days' },
      {
        value: '24h',
        label: 'Last 24 hours',
        labelBadge: <S.DemoBadge>Short range</S.DemoBadge>,
      },
    ]
  }, [])

  const menuDemoItems = React.useMemo((): readonly MenuDropdownItem[] => {
    return [
      {
        key: 'export',
        label: 'Export chart (PNG)',
        icon: <Download size={16} aria-hidden />,
        onClick: () => setMenuDemoHint('Export chart (PNG)'),
      },
      {
        key: 'share',
        label: 'Copy share link',
        icon: <Share2 size={16} aria-hidden />,
        onClick: () => setMenuDemoHint('Copy share link'),
      },
      { key: 'disabled', label: 'Coming soon', icon: <PieChart size={16} aria-hidden />, disabled: true },
    ]
  }, [])

  return (
    <S.Page>
      <S.Header>
        <S.Title>Charts &amp; components showcase</S.Title>
        <S.Subtitle>
          Internal review page for the Data Portal design system: <strong>Recharts-backed charts</strong> (
          <code>DP*Chart</code> in <code>src/components/charts</code>), shared <strong>UI primitives</strong>{' '}
          (<code>src/components/ui</code>), and <strong>AG Grid Community</strong> tables (
          <code>src/components/AgGrid</code>). Toggle shell light/dark to verify both themes.
        </S.Subtitle>
      </S.Header>

      <S.MajorSection aria-labelledby="showcase-other-ui-heading">
        <S.MajorSectionTitle id="showcase-other-ui-heading">Other reusable UI</S.MajorSectionTitle>
        <S.MajorSectionLead>
          Production card and dropdown primitives — same components used across the app, not demo-only stubs.
          Sign off spacing, hover, and filter UX here before they ship in feature surfaces.
        </S.MajorSectionLead>

        <S.DemoSection aria-labelledby="showcase-cards-heading">
          <div>
            <S.CardTitle id="showcase-cards-heading">SurfaceCard &amp; ClickableCard</S.CardTitle>
            <S.CardDescription>
              Solid elevated surface, frosted glass, and interactive tile — use for panels, chart shells, and
              navigational tiles.
            </S.CardDescription>
          </div>
          <S.DemoCardsRow>
            <SurfaceCard variant="solid" padding="md" aria-label="Example: solid surface card">
              <S.DemoCardBody>
                <S.CardTitle as="h3">SurfaceCard · solid</S.CardTitle>
                <S.CardDescription>
                  Elevated background, resting shadow, no hover lift — use for static panels and chart shells.
                </S.CardDescription>
              </S.DemoCardBody>
            </SurfaceCard>
            <SurfaceCard variant="glass" padding="md" aria-label="Example: glass surface card">
              <S.DemoCardBody>
                <S.CardTitle as="h3">SurfaceCard · glass</S.CardTitle>
                <S.CardDescription>
                  Frosted glass treatment — pair with busy backgrounds the same way as the chart cards on this
                  page.
                </S.CardDescription>
              </S.DemoCardBody>
            </SurfaceCard>
            <ClickableCard
              variant="solid"
              padding="md"
              aria-label="Example: clickable card"
              onClick={() => setClickCount((c) => c + 1)}
            >
              <S.DemoCardBody>
                <S.CardTitle as="h3">ClickableCard</S.CardTitle>
                <S.CardDescription>
                  Native button with hover elevation and press feedback — use for navigational tiles.
                </S.CardDescription>
                <S.DemoClickHint>Clicks: {clickCount}</S.DemoClickHint>
              </S.DemoCardBody>
            </ClickableCard>
          </S.DemoCardsRow>
        </S.DemoSection>

        <S.DemoSection aria-labelledby="showcase-dropdowns-heading">
          <div>
            <S.CardTitle id="showcase-dropdowns-heading">Dropdown components</S.CardTitle>
            <S.CardDescription>
              <strong>FilterDropdown</strong> — branded single-select filter. <strong>CustomDropdown</strong>{' '}
              — compact form-style select. <strong>MenuDropdown</strong> — action menu with callbacks. See{' '}
              <code>src/components/ui/DROPDOWNS.md</code> for when to use which.
            </S.CardDescription>
          </div>
          <S.DemoDropdownGrid>
            <S.DemoDropdownCell>
              <S.CardDescription as="span">FilterDropdown</S.CardDescription>
              <FilterDropdown
                options={FILTER_DEMO_OPTIONS}
                value={filterDemoValue}
                onChange={setFilterDemoValue}
                icon={BarChart3}
              />
              <S.DemoDropdownHint>Selected: {filterDemoValue}</S.DemoDropdownHint>
            </S.DemoDropdownCell>
            <S.DemoDropdownCell>
              <S.CardDescription as="span">CustomDropdown</S.CardDescription>
              <CustomDropdown
                value={customDemoValue}
                options={customDemoOptions}
                onChange={setCustomDemoValue}
                placeholder="Range…"
                aria-label="Example date range"
              />
              <S.DemoDropdownHint>Selected: {customDemoValue}</S.DemoDropdownHint>
            </S.DemoDropdownCell>
            <S.DemoDropdownCell>
              <S.CardDescription as="span">MenuDropdown</S.CardDescription>
              <MenuDropdown
                label="Chart actions"
                icon={<PieChart size={16} aria-hidden />}
                items={menuDemoItems}
              />
              <S.DemoDropdownHint>
                {menuDemoHint ? `Last action: ${menuDemoHint}` : 'Open the menu to run an action.'}
              </S.DemoDropdownHint>
            </S.DemoDropdownCell>
          </S.DemoDropdownGrid>
        </S.DemoSection>
      </S.MajorSection>

      <S.MajorSection aria-labelledby="showcase-charts-heading">
        <S.MajorSectionTitle id="showcase-charts-heading">Chart library</S.MajorSectionTitle>
        <S.MajorSectionLead>
          Import from <code>components/charts</code>. Do not use raw Recharts in features — wrappers own
          theme, tooltips, and default margins (see <code>AGENTS.md</code>).
        </S.MajorSectionLead>

        <S.SubSection aria-labelledby="charts-bars-heading">
          <S.SubSectionTitle id="charts-bars-heading">Bars &amp; columns</S.SubSectionTitle>
          <S.Grid>
            <S.Card>
              <S.CardTitle>Bar Chart</S.CardTitle>
              <S.CardDescription>Monthly revenue with formatted Y-axis.</S.CardDescription>
              <BarChartExample />
            </S.Card>

            <S.Card>
              <S.CardTitle>Bar Chart with Brush</S.CardTitle>
              <S.CardDescription>Daily orders with zoom/brush slider enabled.</S.CardDescription>
              <BarChartWithBrushExample />
            </S.Card>

            <S.CardFullWidth>
              <S.CardTitle>Horizontal bar — cost by portfolio</S.CardTitle>
              <S.CardDescription>
                Use <code>DPHorizontalBarChart</code> for ranked categories with numeric extent on the bottom
                axis (Snowflake-style spend). Sort data before passing; set <code>showBarLabels</code> for end
                caps.
              </S.CardDescription>
              <HorizontalBarSnowflakePortfolioExample />
            </S.CardFullWidth>

            <S.Card>
              <S.CardTitle>Stacked Bar Chart</S.CardTitle>
              <S.CardDescription>Regional revenue breakdown (absolute values).</S.CardDescription>
              <StackedBarChartExample />
            </S.Card>

            <S.Card>
              <S.CardTitle>100% Stacked Bar</S.CardTitle>
              <S.CardDescription>Regional share as percentage of total.</S.CardDescription>
              <StackedBarPercentExample />
            </S.Card>
          </S.Grid>
        </S.SubSection>

        <S.SubSection aria-labelledby="charts-lines-heading">
          <S.SubSectionTitle id="charts-lines-heading">Lines &amp; areas</S.SubSectionTitle>
          <S.Grid>
            <S.TwoUpRow>
              <S.Card>
                <S.CardTitle>Area Chart</S.CardTitle>
                <S.CardDescription>Daily orders trend with gradient fill.</S.CardDescription>
                <AreaChartExample />
              </S.Card>
              <S.Card>
                <S.CardTitle>Line Chart</S.CardTitle>
                <S.CardDescription>Single series with data point dots.</S.CardDescription>
                <LineChartExample />
              </S.Card>
            </S.TwoUpRow>

            <S.Card>
              <S.CardTitle>Multi-Line Chart</S.CardTitle>
              <S.CardDescription>Multiple metrics with brush and top legend.</S.CardDescription>
              <MultiLineChartExample />
            </S.Card>

            <S.CardFullWidth>
              <S.CardTitle>Databricks planned budget vs actuals vs year-end outlook</S.CardTitle>
              <S.CardDescription>
                <code>DPMultiLineChart</code> with per-series <code>forecastFromIndex</code> (solid actuals,
                dashed outlook), <code>showPointLabels</code>, and no grid — same pattern as finance
                dashboards.
              </S.CardDescription>
              <MultiLineForecastBudgetExample />
            </S.CardFullWidth>
          </S.Grid>
        </S.SubSection>

        <S.SubSection aria-labelledby="charts-radial-heading">
          <S.SubSectionTitle id="charts-radial-heading">Radial, gauge &amp; KPI</S.SubSectionTitle>
          <S.Grid>
            <S.TwoUpRow>
              <S.Card>
                <S.CardTitle>Pie Chart</S.CardTitle>
                <S.CardDescription>Business vertical distribution with labels.</S.CardDescription>
                <PieChartExample />
              </S.Card>
              <S.Card>
                <S.CardTitleRow>
                  <S.CardTitle>Donut chart</S.CardTitle>
                  <CustomDropdown
                    value={donutShowcaseVariant}
                    options={DONUT_SHOWCASE_OPTIONS}
                    onChange={setDonutShowcaseVariant}
                    icon={<PieChart size={16} aria-hidden />}
                    placeholder="Variant…"
                    aria-label="Donut chart example variant"
                  />
                </S.CardTitleRow>
                {donutShowcaseVariant === 'callouts' ? (
                  <S.CardDescription>
                    Outside labels with leader lines, per-slice colors, and <code>labelValueFormatter</code>{' '}
                    for compact millions. Pass <code>labelMinPercent</code> as <code>0</code> to keep tiny
                    slices labeled.
                  </S.CardDescription>
                ) : (
                  <S.CardDescription>
                    Same <code>DPDonutChart</code> with <code>centerContent</code> in the hole — compact
                    KPI-style summary.
                  </S.CardDescription>
                )}
                <S.DonutVariantPanel>
                  {donutShowcaseVariant === 'callouts' ? (
                    <DonutChartExample />
                  ) : (
                    <DonutChartWithCenterSummaryExample />
                  )}
                </S.DonutVariantPanel>
              </S.Card>
            </S.TwoUpRow>

            <S.Card>
              <S.CardTitle>Gauge chart</S.CardTitle>
              <S.CardDescription>Radial progress with centered value.</S.CardDescription>
              <GaugeChartExample />
            </S.Card>
          </S.Grid>

          <S.TwoUpRow>
            <S.Card>
              <S.CardTitle>KPI tiles</S.CardTitle>
              <S.CardDescription>
                Headline metrics with optional delta — same <code>DPKPI</code> primitive as dashboard widgets.
              </S.CardDescription>
              <KPIRowExample />
            </S.Card>
            <S.Card>
              <S.CardTitle>KPI — YTD comparison</S.CardTitle>
              <S.CardDescription>
                Pass <code>columns</code> for side-by-side headline figures; use{' '}
                <code>formatScaledSuffix</code> from the chart utils for compact millions (see example
                source).
              </S.CardDescription>
              <KPIYtdCompareExample />
            </S.Card>
          </S.TwoUpRow>
        </S.SubSection>

        <S.SubSection aria-labelledby="charts-special-heading">
          <S.SubSectionTitle id="charts-special-heading">Composed &amp; specialty</S.SubSectionTitle>
          <S.Grid>
            <S.CardFullWidth>
              <S.CardTitle>Composed (combo) chart</S.CardTitle>
              <S.CardDescription>
                Bars (revenue, left axis) and line (margin %, right axis) on one category axis — use{' '}
                <code>{`yAxisId: 'right'`}</code> on the series plus <code>rightYAxis</code> on{' '}
                <code>DPComposedChart</code>.
              </S.CardDescription>
              <ComposedChartExample />
            </S.CardFullWidth>

            <S.Card>
              <S.CardTitle>Scatter chart</S.CardTitle>
              <S.CardDescription>
                P95 latency vs throughput with bubble size from concurrent sessions — synthetic data follows a
                saturation curve (higher req/s → higher tail latency).
              </S.CardDescription>
              <ScatterChartExample />
            </S.Card>

            <S.Card>
              <S.CardTitle>Funnel chart</S.CardTitle>
              <S.CardDescription>Sequential funnel with themed stages.</S.CardDescription>
              <FunnelChartExample />
            </S.Card>

            <S.CardFullWidth>
              <S.CardTitle>Sankey diagram</S.CardTitle>
              <S.CardDescription>
                Three acquisition sources funnel into signup, then split into first purchase vs dropped — link
                sizes are intentionally uneven (paid ads dominates; most signups do not convert).
              </S.CardDescription>
              <SankeyChartExample />
            </S.CardFullWidth>
          </S.Grid>
        </S.SubSection>
      </S.MajorSection>

      <S.MajorSection aria-labelledby="showcase-ag-grid-heading">
        <S.MajorSectionTitle id="showcase-ag-grid-heading">Data tables (AG Grid)</S.MajorSectionTitle>
        <S.MajorSectionLead>
          Community edition only. Rationale vs TanStack Table / Enterprise:{' '}
          <code>docs/table-grid-selection.md</code>.
        </S.MajorSectionLead>

        <S.CardFullWidth>
          <S.CardTitle>AG Grid — catalog slice</S.CardTitle>
          <S.CardDescription>
            Community grid with quick filter, pagination, and typed column defs — see <code>DPAgGrid</code> +
            <code>AgGridShowcaseExample</code>.
          </S.CardDescription>
          <AgGridShowcaseExample />
        </S.CardFullWidth>

        <S.CardFullWidth>
          <S.CardTitle>AG Grid — tabular matrix (year × platform)</S.CardTitle>
          <S.CardDescription>
            Snowflake-style <strong>tabular overview</strong> on mock data: nested column groups (year ×
            platform),
            <code>enableCellSpan</code> + <code>spanRows</code>, compact row/header height, per-column
            heatmap, zebra rows, and a pinned <strong>Grand Total</strong> row. Values are pre-aggregated
            (Community has no pivot / row-group engine).
          </S.CardDescription>
          <TabularMatrixAgGridExample />
        </S.CardFullWidth>
      </S.MajorSection>

      <S.MajorSection aria-labelledby="showcase-states-heading">
        <S.MajorSectionTitle id="showcase-states-heading">Chart wrapper states</S.MajorSectionTitle>
        <S.MajorSectionLead>
          Shared <code>ChartWrapper</code> loading, error, and empty treatments — apply to every{' '}
          <code>DP*</code> chart type.
        </S.MajorSectionLead>

        <S.CardFullWidth>
          <S.CardTitle>States</S.CardTitle>
          <S.CardDescription>Loading, error, and empty states work on every chart type.</S.CardDescription>
          <S.StatesRow>
            <div>
              <S.CardDescription>Loading</S.CardDescription>
              <LoadingStateExample />
            </div>
            <div>
              <S.CardDescription>Error</S.CardDescription>
              <ErrorStateExample />
            </div>
            <div>
              <S.CardDescription>Empty</S.CardDescription>
              <EmptyStateExample />
            </div>
          </S.StatesRow>
        </S.CardFullWidth>
      </S.MajorSection>
    </S.Page>
  )
}
