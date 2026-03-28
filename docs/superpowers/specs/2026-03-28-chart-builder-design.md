# Chart Builder — Deepdive-BI Style

**Date:** 2026-03-28
**Status:** Draft
**Author:** Harsha Reddy

## Problem

The dashboard canvas page has source tabs (SQL, Semantic, Metrics) that show field lists but lack a chart-building flow. Users cannot select fields, configure a chart, preview it, and pin it to a dashboard. The AI-BI tab has a conversational creation flow that works well and stays unchanged. The other source types need a deepdive-bi-style chart builder experience.

## Solution Overview

A dedicated chart builder page (`/chart-builder`) with a two-panel layout: source browser + field inspector on the left, chart builder (formula bar, type picker, preview) on the right. Users enter from the dashboard canvas page's source browser panel. After building a chart, they pin it to a dashboard and navigate there to see it in context.

## User Flow

1. User is on the dashboard canvas page editing a dashboard
2. In the left source panel, they click a SQL/Semantic/Metrics source
3. App navigates to `/chart-builder?source={sourceId}&tab={sql|semantic|metrics}&dashboard={canvasId}`
4. User selects measures, dimensions, date fields via checkboxes
5. Formula bar populates with color-coded field pills
6. User picks a chart type from the 8-type library
7. User clicks "Go" — chart preview renders
8. User clicks "Pin to Dashboard"
9. Pin dialog shows: pre-selected originating dashboard (or searchable list + new dashboard option)
10. On confirm: toast with "View Dashboard →" link
11. Clicking link navigates to canvas page; new widget has a brief highlight animation

## Architecture

### New Route

```
/chart-builder — ChartBuilderPage
  Query params:
    - source: sourceId (optional, pre-selects a source)
    - tab: 'sql' | 'semantic' | 'metrics' (optional, pre-selects tab)
    - dashboard: canvasId (optional, pre-selects pin target)
```

### Page Layout: ChartBuilderPage

Two-panel, equal-width layout.

#### Left Panel — Source Browser + Field Inspector

**Source Tab Bar:**
- Three tabs: SQL | Semantic | Metrics
- Pre-selected if `tab` query param is present

**Source List:**
- Searchable list of sources for the active tab
- SQL: tables (fact_deliveries, fact_orders, dim_stores, etc.)
- Semantic: dbt semantic models (order_metrics, delivery_performance, etc.)
- Metrics: defined metrics (GOV, Net Revenue, Active Dashers, etc.)
- Pre-selected if `source` query param is present

**Field Inspector** (appears when a source is selected):
- Three collapsible sections: Measures, Dimensions, Date Fields
- Each section header shows field count badge
- Fields have checkboxes for selection
- Left-border color coding: green (measures), blue (dimensions), yellow (dates)
- Measures show aggregation dropdown on selection (SUM, COUNT, AVG, MIN, MAX)
- Date Fields: single-select (radio behavior)
- Search input to filter fields within the source
- Field reclassification: icon to change a field's role (measure ↔ dimension ↔ date)

#### Right Panel — Chart Builder

**Formula Bar:**
- Selected fields displayed as removable color-coded pills
- Green pills: measures with aggregation label (e.g., "SUM(total_deliveries)")
- Blue pills: dimensions
- Yellow pills: date field
- "Go" button (disabled until at least one measure is selected)
- Empty state: "Select fields from the source browser"

**Actions Row:**
- Chart type library dropdown (8 types in 4×2 grid)
- "Pin to Dashboard" button (primary, disabled until chart has data)
- "Save Chart" button (secondary, disabled until chart has data)

**Chart Preview:**
- Full remaining height
- Renders chart based on selected fields, type, and mock data
- Uses Recharts for rendering
- Empty state when no query has been executed

### Chart Types (8)

| Type | Icon | Description |
|------|------|-------------|
| Column | BarChart3 | Vertical bars |
| Bar | BarChartHorizontal | Horizontal bars |
| Line | LineChart | Line chart |
| Area | AreaChart | Filled area |
| Scatter | ScatterChart | Scatter plot |
| Donut | PieChart | Donut/ring chart |
| KPI | Hash | Single value with trend |
| Table | Table2 | Tabular data view |

### Pin to Dashboard Dialog

**Two tabs:**

**Existing Dashboard tab:**
- Search input to filter dashboards
- Scrollable list of dashboards showing: name, domain, tier, widget count
- If `dashboard` query param was provided, that dashboard is pre-selected
- "Pin to Dashboard" confirm button

**New Dashboard tab:**
- Dashboard name input
- Domain dropdown (Logistics, CX, DashPass, Marketplace, Finance)
- Tier dropdown (T0, T1, T2)
- "Create & Pin" button

**On pin:**
- Chart config saved to localStorage
- Layout item added to dashboard: `{ chartId, x: 0, y: Infinity, w: 6, h: 4 }`
- Toast: `"Chart pinned to '{Dashboard Name}'"` with "View Dashboard →" link
- Link navigates to `/dashboard/draft?id={canvasId}&highlight={chartId}`

### Dashboard Canvas Page Changes

**Source browser panel becomes a source launcher:**
- Same tab bar: AI-BI | SQL | Semantic | Metrics | Cache
- AI-BI tab: unchanged (conversational widget creation)
- Cache tab: unchanged
- SQL/Semantic/Metrics tabs: show source list with name + brief description
- Clicking a source navigates to `/chart-builder?source={sourceId}&tab={tab}&dashboard={canvasId}`
- No inline field inspection for these tabs

**New widget highlight:**
- When navigated with `highlight` query param, the matching widget gets a brief glow animation (2s fade-out border highlight)

## Data Model

### Field

```typescript
interface Field {
  id: string
  name: string
  role: 'measure' | 'dimension' | 'date'
  dataType: 'number' | 'string' | 'date'
  description?: string
  aggregation?: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX'
}
```

### ChartConfig

```typescript
interface ChartConfig {
  id: string
  name: string
  type: ChartType
  query: {
    sourceId: string
    sourceType: 'sql' | 'semantic' | 'metrics'
    measures: Field[]
    dimensions: Field[]
    dateField?: Field
  }
  createdAt: string
  updatedAt: string
}

type ChartType = 'column' | 'bar' | 'line' | 'area' | 'scatter' | 'donut' | 'kpi' | 'table'
```

### Storage

Charts and dashboards persist in localStorage via the existing `canvasStorage` utility:

- `data-portal-charts` → `ChartConfig[]` (new key for saved charts)
- Existing dashboard storage unchanged
- Dashboard layout items reference `chartId` to link to chart configs
- New widgets appended at bottom: `{ chartId, x: 0, y: Infinity, w: 6, h: 4 }`

## Mock Data

All data is mock-driven (no backend). Field lists per source are hardcoded:

- SQL sources: 4-6 tables with 6-10 fields each
- Semantic sources: 3-5 models with 5-8 fields each
- Metrics sources: flat list of pre-defined metrics (these map to KPI chart type by default)

Chart preview uses generated mock data based on selected fields and chart type.

## Components

### New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ChartBuilderPage` | `pages/chart-builder-page.tsx` | Page component, manages state, two-panel layout |
| `FieldInspector` | `components/chart-builder/field-inspector.tsx` | Measures/dimensions/dates with checkboxes |
| `FormulaBar` | `components/chart-builder/formula-bar.tsx` | Selected field pills + Go button |
| `ChartTypeLibrary` | `components/chart-builder/chart-type-library.tsx` | 8-type grid dropdown |
| `ChartPreview` | `components/chart-builder/chart-preview.tsx` | Recharts rendering for all 8 types |
| `ChartActions` | `components/chart-builder/chart-actions.tsx` | Pin + Save buttons |
| `PinToDashboardDialog` | `components/chart-builder/pin-to-dashboard-dialog.tsx` | Pin dialog with existing/new tabs |
| `SourceList` | `components/chart-builder/source-list.tsx` | Searchable source list |
| `SourceTabBar` | `components/chart-builder/source-tab-bar.tsx` | SQL/Semantic/Metrics tabs |

### Modified Components

| Component | Change |
|-----------|--------|
| `SourceBrowserPanel` | SQL/Semantic/Metrics tabs become source launchers (navigate to chart builder) |
| `ChartCard` | Support new chart types (column, scatter, donut, table) |
| `dashboard-canvas-page` | Handle `highlight` query param for new widget animation |
| `routes.tsx` | Add `/chart-builder` route |

## Out of Scope

- Backend/API integration (remains mock-driven)
- Real query execution
- Chart editing (edit existing pinned charts)
- Cross-filtering between dashboard widgets
- Collaborative editing
- Drag-to-position within dashboard on pin (uses auto-placement)

## Open Questions

None — all decisions resolved during brainstorming.
