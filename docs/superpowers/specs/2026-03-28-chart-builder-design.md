# Chart Builder — Deepdive-BI Style

**Date:** 2026-03-28
**Status:** Draft
**Author:** Harsha Reddy

## Problem

The dashboard canvas page has source tabs (SQL, Semantic, Metrics) that show field lists but lack a chart-building flow. Users cannot select fields, configure a chart, preview it, and pin it to a dashboard. The AI-BI tab has a conversational creation flow that works well and stays unchanged. The other source types need a deepdive-bi-style chart builder experience.

## Solution Overview

A dedicated chart builder page (`/chart-builder`) with a two-panel layout: source browser + field inspector on the left, chart builder (formula bar, type picker, preview) on the right. Users enter from the dashboard canvas page's source browser panel. After building a chart, they pin it to a dashboard and navigate there to see it in context.

## User Flow

1. User is on the dashboard canvas page editing a dashboard (route: `/dashboard/:id`)
2. In the left source panel, they click a SQL/Semantic/Metrics source
3. App navigates to `/chart-builder?source={sourceId}&tab={sql|semantic|metrics}&dashboard={canvasId}`
4. User selects measures, dimensions, date fields via checkboxes
5. Chart preview updates live as fields are selected (no "Go" button needed — mock data generates immediately)
6. User picks a chart type from the 8-type library
7. User clicks "Pin to Dashboard"
8. Pin dialog shows: pre-selected originating dashboard (or searchable list + new dashboard option)
9. On confirm: toast with "View Dashboard →" link
10. Clicking link navigates to `/dashboard/{canvasId}?highlight={widgetId}`; new widget scrolls into view with a 2s DoorDash-red (#FF3A00) border glow fade-out

## Architecture

### New Route

```
/chart-builder — ChartBuilderPage
  Nested under RootLayout (TopNav still visible)
  Query params:
    - source: sourceId (optional, pre-selects a source)
    - tab: 'sql' | 'semantic' | 'metrics' (optional, pre-selects tab)
    - dashboard: canvasId (optional, pre-selects pin target)
```

Back navigation: a "← Back to Dashboard" link in the top-left of the page (below TopNav) that returns to the originating dashboard. If no dashboard context, link says "← Back" and navigates to `/dashboards`.

### Page Layout: ChartBuilderPage

Two-panel, 50/50 flex layout filling the available space below TopNav. No AI sidebar on this page.

```
┌──────────────────────────────────────────────────────────┐
│ TopNav (RootLayout)                                      │
├──────────────────────────────────────────────────────────┤
│ ← Back to Dashboard                                      │
├────────────────────────┬─────────────────────────────────┤
│ SOURCE BROWSER          │ CHART BUILDER                   │
│                         │                                 │
│ [SQL] [Semantic] [Metrics] │ Formula Bar: [pills...] │
│                         │                                 │
│ Source List (searchable)│ Chart Type: [8-type grid]       │
│   ○ fact_deliveries     │                                 │
│   ○ fact_orders         │ ┌─────────────────────────────┐ │
│   ○ dim_stores          │ │                             │ │
│                         │ │     Chart Preview           │ │
│ ─── Field Inspector ─── │ │     (Recharts)              │ │
│ ▸ Measures (3)          │ │                             │ │
│   ☑ total_deliveries    │ │                             │ │
│   ☐ avg_delivery_time   │ └─────────────────────────────┘ │
│ ▸ Dimensions (4)        │                                 │
│   ☑ market_name         │ [Pin to Dashboard]              │
│ ▸ Date Fields           │                                 │
│   ◉ delivery_date       │                                 │
├────────────────────────┴─────────────────────────────────┤
```

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
- Field reclassification: session-only icon to change a field's role (measure ↔ dimension ↔ date). Does not persist — resets when navigating away.

#### Right Panel — Chart Builder

**Formula Bar:**
- Selected fields displayed as removable color-coded pills
- Green pills: measures with aggregation label (e.g., "SUM(total_deliveries)")
- Blue pills: dimensions
- Yellow pills: date field
- Empty state: "Select fields from the source browser"

**Chart Type Library:**
- Inline 4×2 grid (always visible, not a dropdown) showing 8 chart types
- Active type highlighted with DoorDash-red border
- Default selection: Column (or KPI if source is Metrics type)

**Chart Preview:**
- Full remaining height
- Updates live as fields are selected — no "Go" button needed since data is mock-generated
- Uses Recharts for all types except Table (which uses a styled HTML table)
- Empty state: centered message "Select at least one measure to preview"

**Actions (bottom of right panel):**
- "Pin to Dashboard" button (primary, disabled until at least one measure is selected)

### Chart Types (8)

| Type | Recharts Component | Icon | Notes |
|------|-------------------|------|-------|
| Column | `BarChart` (default vertical) | BarChart3 | Vertical bars — replaces existing `bar` type |
| Bar | `BarChart` with `layout="vertical"` | BarChartHorizontal | Horizontal bars |
| Line | `LineChart` | TrendingUp | Line chart |
| Area | `AreaChart` | AreaChart | Filled area with gradient |
| Scatter | `ScatterChart` | Circle | Scatter plot — requires 2+ measures |
| Donut | `PieChart` with `innerRadius` | PieChart | Replaces existing `pie` type |
| KPI | Custom component | Hash | Single value with trend arrow |
| Table | Styled HTML `<table>` | Table2 | Not Recharts — raw tabular view |

**WidgetConfig type update:** Extend `WidgetConfig.type` to:
```typescript
type: 'column' | 'bar' | 'line' | 'area' | 'scatter' | 'donut' | 'kpi' | 'table'
```
This replaces the old `'bar' | 'pie'` values. Existing widgets using `'bar'` map to `'column'`, existing `'pie'` maps to `'donut'`. A one-time migration runs in `canvasStorage` on load.

**Metrics source + non-KPI chart types:** Allowed. If a user selects a metrics source, the chart type defaults to KPI but the user can switch to any type. Metrics fields are treated as measures with a pre-set aggregation.

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
- WidgetConfig created from chart state (auto-named: `"{SourceName} — {ChartType}"`, e.g. "fact_deliveries — Column")
- Widget saved via `canvasStorage`
- Layout item added to dashboard: `{ widgetId, x: 0, y: Infinity, w: 6, h: 4 }`
- Toast: `"Chart pinned to '{Dashboard Name}'"` with "View Dashboard →" link
- Link navigates to `/dashboard/{canvasId}?highlight={widgetId}`

### Dashboard Canvas Page Changes

**Source browser panel becomes a source launcher:**
- Same tab bar: AI-BI | SQL | Semantic | Metrics | Cache
- AI-BI tab: unchanged (conversational widget creation)
- Cache tab: unchanged
- SQL/Semantic/Metrics tabs: show source list with name + brief description only. The existing inline field inspector for these tabs is removed — field inspection now lives exclusively on the chart builder page.
- Clicking a source navigates to `/chart-builder?source={sourceId}&tab={tab}&dashboard={canvasId}`

**New widget highlight:**
- When navigated with `highlight` query param, the matching widget:
  1. Scrolls into view via `scrollIntoView({ behavior: 'smooth', block: 'center' })`
  2. Gets a 2s border glow animation: `border: 2px solid #FF3A00` fading to transparent
  3. Query param is cleared from URL after animation completes (via `replaceState`)

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

### WidgetConfig (extended)

```typescript
// Updated type union — replaces old 'bar'|'pie' with 'column'|'donut'
interface WidgetConfig {
  id: string
  title: string
  subtitle: string
  type: 'column' | 'bar' | 'line' | 'area' | 'scatter' | 'donut' | 'kpi' | 'table'
  data?: any[]
  kpiValue?: string
  kpiChange?: string
  kpiTrend?: 'up' | 'down' | 'flat'
  description?: string
  category?: string
  metricId?: string
  // New fields for chart builder widgets:
  query?: {
    sourceId: string
    sourceType: 'sql' | 'semantic' | 'metrics'
    measures: Field[]
    dimensions: Field[]
    dateField?: Field
  }
}
```

### Storage

**New `canvasStorage` methods:**
- `migrateWidgetTypes()` — one-time migration: `'bar'` → `'column'`, `'pie'` → `'donut'` across all saved widgets
- Auto-runs on first `getCanvasWidgets()` call

Existing keys and methods unchanged. No separate `data-portal-charts` key — charts are saved directly as `WidgetConfig` entries on the target dashboard, consistent with how AI-BI widgets are saved today.

### CanvasLayoutItem

Uses existing `widgetId` field (not `chartId`):
```typescript
interface CanvasLayoutItem {
  widgetId: string  // matches WidgetConfig.id
  x: number
  y: number
  w: number
  h: number
}
```

## Mock Data

All data is mock-driven (no backend). Field lists per source are hardcoded in `src/app/data/mock/chart-builder-data.ts`:

- SQL sources: 4-6 tables with 6-10 fields each
- Semantic sources: 3-5 models with 5-8 fields each
- Metrics sources: flat list of pre-defined metrics

**Mock chart data generation:** When fields are selected, generate mock data arrays:
- Dimensions → category labels (e.g., market names: "SF", "LA", "NYC", "CHI", "SEA")
- Measures → random numbers in a plausible range (100-10000)
- Date fields → last 7 data points (weekly or daily labels)
- KPI → single value with a random change percentage
- Table → 10 rows combining all selected fields
- Scatter → pairs of measure values (requires 2+ measures)

## Components

### New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ChartBuilderPage` | `pages/chart-builder-page.tsx` | Page component, manages state, two-panel layout |
| `FieldInspector` | `components/chart-builder/field-inspector.tsx` | Measures/dimensions/dates with checkboxes |
| `FormulaBar` | `components/chart-builder/formula-bar.tsx` | Selected field pills display |
| `ChartTypeLibrary` | `components/chart-builder/chart-type-library.tsx` | 8-type inline grid selector |
| `ChartPreview` | `components/chart-builder/chart-preview.tsx` | Recharts rendering for 7 types + HTML table |
| `ChartActions` | `components/chart-builder/chart-actions.tsx` | Pin button |
| `PinToDashboardDialog` | `components/chart-builder/pin-to-dashboard-dialog.tsx` | Pin dialog with existing/new tabs |
| `SourceList` | `components/chart-builder/source-list.tsx` | Searchable source list |
| `SourceTabBar` | `components/chart-builder/source-tab-bar.tsx` | SQL/Semantic/Metrics tabs |

### Modified Components

| Component | Change |
|-----------|--------|
| `SourceBrowserPanel` | SQL/Semantic/Metrics tabs become source launchers. Remove inline field inspector and `onSourceSelect`/`onChartTypeSelect` callbacks for these tabs. Panel uses `useNavigate` internally to navigate to `/chart-builder` on source click. AI-BI and Cache tabs unchanged. |
| `ChartCard` | Support new chart types: `column` (vertical bars), `bar` (horizontal bars via `layout="vertical"`), `scatter` (`ScatterChart` + `Scatter` — new Recharts imports), `donut` (PieChart with innerRadius), `table` (HTML table). Alias map for backward compat: old `'bar'` renders as `'column'`, old `'pie'` renders as `'donut'`. |
| `dashboard-canvas-page` | Handle `highlight` query param: scroll-into-view + border glow animation |
| `routes.tsx` | Add `/chart-builder` route under RootLayout |
| `artifacts.ts` | Update `WidgetConfig.type` union, add optional `query` field |
| `canvasStorage` | Add `migrateWidgetTypes()` for backward compat |

## Out of Scope

- Backend/API integration (remains mock-driven)
- Real query execution
- Chart editing (edit existing pinned charts post-pin)
- Cross-filtering between dashboard widgets
- Collaborative editing
- Drag-to-position within dashboard on pin (uses auto-placement at bottom)
- Standalone "saved charts" library (charts are always pinned to a dashboard)
- Migrating `GoldenDashboard.chartType`, `ChartWidget`, `AIWidgetCreator`, or cache widget `chartType` values — these remain as-is (`'bar'`, `'line'`, `'area'`). Migration only applies to user-created `WidgetConfig` entries in `canvasStorage`. `ChartCard` rendering handles both old and new type names via a simple alias map.
