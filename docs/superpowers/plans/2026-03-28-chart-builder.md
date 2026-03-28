# Chart Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deepdive-BI style chart builder page where users select fields from SQL/Semantic/Metrics sources, preview charts live, and pin them to dashboards.

**Architecture:** Dedicated `/chart-builder` route with two-panel layout (source browser + field inspector on left, formula bar + chart type picker + live preview on right). Users enter from the dashboard canvas page source browser, build charts, and pin back to dashboards. All data is mock-driven.

**Tech Stack:** React 18, TypeScript, styled-components, Recharts, framer-motion v6.5.1, React Router 7 (hash routing), @doordash/prism-react, lucide-react

**Spec:** `docs/superpowers/specs/2026-03-28-chart-builder-design.md`

---

## File Map

### New Files

| File | Responsibility |
|------|---------------|
| `src/app/data/mock/chart-builder-data.ts` | Mock sources, fields per source, mock chart data generator |
| `src/app/components/chart-builder/source-tab-bar.tsx` | SQL / Semantic / Metrics tab switcher |
| `src/app/components/chart-builder/source-list.tsx` | Searchable source list for active tab |
| `src/app/components/chart-builder/field-inspector.tsx` | Measures/dimensions/dates with checkboxes, aggregation, search |
| `src/app/components/chart-builder/formula-bar.tsx` | Color-coded field pills with remove |
| `src/app/components/chart-builder/chart-type-library.tsx` | 4×2 grid of 8 chart types |
| `src/app/components/chart-builder/chart-preview.tsx` | Recharts rendering (7 types) + HTML table |
| `src/app/components/chart-builder/pin-to-dashboard-dialog.tsx` | Pin dialog with existing/new dashboard tabs |
| `src/app/pages/chart-builder-page.tsx` | Page component: state management, two-panel layout, pin action button (spec's `ChartActions` is inlined here — too thin to warrant its own file) |

### Modified Files

| File | Change |
|------|--------|
| `src/types/artifacts.ts` | Extend `WidgetConfig.type` union, add optional `query` field, export `Field` type |
| `src/app/data/canvas-storage.ts` | Add `migrateWidgetTypes()` method |
| `src/app/routes.tsx` | Add `/chart-builder` route |
| `src/app/components/panels/source-browser-panel.tsx` | SQL/Semantic/Metrics tabs become navigating launchers |
| `src/app/components/dashboard/chart-card.tsx` | Support column, bar (horizontal), scatter, donut, table types + alias map |
| `src/app/components/dashboard/canvas-grid.tsx` | Pass `highlightWidgetId` prop through to ChartCard |
| `src/app/pages/dashboard-canvas-page.tsx` | Handle `highlight` query param for widget glow animation; update `generateMockData` to use new type names |

---

## Task 1: Types & Mock Data Foundation

**Files:**
- Modify: `src/types/artifacts.ts`
- Create: `src/app/data/mock/chart-builder-data.ts`
- Modify: `src/app/data/canvas-storage.ts`

- [ ] **Step 1: Extend WidgetConfig type in artifacts.ts**

Add the `Field` interface and update `WidgetConfig`:

```typescript
// Add above WidgetConfig in src/types/artifacts.ts

export interface ChartBuilderField {
  id: string;
  name: string;
  role: 'measure' | 'dimension' | 'date';
  dataType: 'number' | 'string' | 'date';
  description?: string;
  aggregation?: 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX';
}

// New chart types for chart builder. Includes legacy 'pie' for backward compat until Task 8.
export type ChartType = 'column' | 'bar' | 'line' | 'area' | 'scatter' | 'donut' | 'pie' | 'kpi' | 'table';

// Alias for spec compliance — spec uses 'Field', we prefix to avoid collisions
export type Field = ChartBuilderField;
```

Update `WidgetConfig.type` to use `ChartType` (which still includes `'pie'` so existing code compiles):
```typescript
export interface WidgetConfig {
  id: string;
  title: string;
  subtitle: string;
  type: ChartType;
  data?: any[];
  kpiValue?: string;
  kpiChange?: string;
  kpiTrend?: 'up' | 'down' | 'flat';
  description?: string;
  category?: string;
  metricId?: string;
  query?: {
    sourceId: string;
    sourceType: 'sql' | 'semantic' | 'metrics';
    measures: ChartBuilderField[];
    dimensions: ChartBuilderField[];
    dateField?: ChartBuilderField;
  };
}
```

- [ ] **Step 2: Create chart-builder-data.ts with mock sources and fields**

Create `src/app/data/mock/chart-builder-data.ts` with:

```typescript
import type { ChartBuilderField, ChartType } from '@/types';

export interface SourceItem {
  id: string;
  name: string;
  description: string;
  type: 'sql' | 'semantic' | 'metrics';
}

export interface SourceFields {
  measures: ChartBuilderField[];
  dimensions: ChartBuilderField[];
  dateFields: ChartBuilderField[];
}

export const CHART_BUILDER_SOURCES: Record<'sql' | 'semantic' | 'metrics', SourceItem[]> = {
  sql: [
    { id: 'sql-1', name: 'fact_deliveries', description: 'Core delivery events table', type: 'sql' },
    { id: 'sql-2', name: 'fact_orders', description: 'Order transactions', type: 'sql' },
    { id: 'sql-3', name: 'dim_merchants', description: 'Merchant dimension table', type: 'sql' },
    { id: 'sql-4', name: 'dim_consumers', description: 'Consumer profiles and attributes', type: 'sql' },
    { id: 'sql-5', name: 'fact_dasher_pay', description: 'Dasher payment events', type: 'sql' },
  ],
  semantic: [
    { id: 'sem-1', name: 'order_metrics', description: 'dbt semantic model — orders', type: 'semantic' },
    { id: 'sem-2', name: 'delivery_performance', description: 'dbt semantic — delivery SLA', type: 'semantic' },
    { id: 'sem-3', name: 'revenue_model', description: 'dbt semantic — revenue attribution', type: 'semantic' },
    { id: 'sem-4', name: 'cx_satisfaction', description: 'dbt semantic — customer satisfaction', type: 'semantic' },
  ],
  metrics: [
    { id: 'met-1', name: 'GOV (Gross Order Value)', description: 'Total order value including tips', type: 'metrics' },
    { id: 'met-2', name: 'Net Revenue', description: 'Revenue after refunds and credits', type: 'metrics' },
    { id: 'met-3', name: 'Active Dashers', description: 'Dashers with >= 1 delivery in period', type: 'metrics' },
    { id: 'met-4', name: 'P50 Delivery Time', description: 'Median delivery duration', type: 'metrics' },
    { id: 'met-5', name: 'DashPass Subscribers', description: 'Total paid DashPass subscribers', type: 'metrics' },
    { id: 'met-6', name: 'Consumer MAUs', description: 'Monthly active users (L28)', type: 'metrics' },
  ],
};

// Field definitions per source
export const SOURCE_FIELDS: Record<string, SourceFields> = {
  'sql-1': {
    measures: [
      { id: 'f-sql1-m1', name: 'total_deliveries', role: 'measure', dataType: 'number', description: 'Count of deliveries' },
      { id: 'f-sql1-m2', name: 'avg_delivery_time', role: 'measure', dataType: 'number', description: 'Average delivery minutes' },
      { id: 'f-sql1-m3', name: 'delivery_fee', role: 'measure', dataType: 'number', description: 'Total delivery fees' },
      { id: 'f-sql1-m4', name: 'tips', role: 'measure', dataType: 'number', description: 'Total tip amount' },
    ],
    dimensions: [
      { id: 'f-sql1-d1', name: 'market_name', role: 'dimension', dataType: 'string', description: 'Market/city' },
      { id: 'f-sql1-d2', name: 'store_type', role: 'dimension', dataType: 'string', description: 'Restaurant/grocery/convenience' },
      { id: 'f-sql1-d3', name: 'delivery_status', role: 'dimension', dataType: 'string', description: 'Delivered/cancelled/returned' },
    ],
    dateFields: [
      { id: 'f-sql1-dt1', name: 'delivery_date', role: 'date', dataType: 'date', description: 'Date of delivery' },
      { id: 'f-sql1-dt2', name: 'created_at', role: 'date', dataType: 'date', description: 'Order creation timestamp' },
    ],
  },
  // Include at least 4 more sources (sql-2, sem-1, sem-2, met-1) with similar structure
  // ... (see full mock data in step)
};

// Dimension label pools for mock data generation
const DIMENSION_LABELS: Record<string, string[]> = {
  market_name: ['San Francisco', 'Los Angeles', 'New York', 'Chicago', 'Seattle', 'Austin', 'Miami'],
  store_type: ['Restaurant', 'Grocery', 'Convenience', 'Alcohol', 'Pet Supplies'],
  delivery_status: ['Delivered', 'Cancelled', 'In Progress', 'Returned'],
  channel: ['iOS', 'Android', 'Web', 'Partner API'],
  tier: ['T0', 'T1', 'T2'],
  region: ['West', 'East', 'Central', 'South'],
  // Default fallback
  default: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
};

const DATE_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Generate mock chart data based on selected fields
export function generateMockChartData(
  measures: ChartBuilderField[],
  dimensions: ChartBuilderField[],
  dateField: ChartBuilderField | null,
  chartType: ChartType,
): any[] {
  if (chartType === 'kpi') {
    return []; // KPI uses kpiValue/kpiChange, not data array
  }

  const labels = dateField
    ? DATE_LABELS
    : dimensions.length > 0
      ? (DIMENSION_LABELS[dimensions[0].name] ?? DIMENSION_LABELS.default).slice(0, 6)
      : ['Value'];

  if (chartType === 'scatter' && measures.length >= 2) {
    return Array.from({ length: 20 }, (_, i) => ({
      name: `Point ${i + 1}`,
      [measures[0].name]: Math.round(Math.random() * 9000 + 1000),
      [measures[1].name]: Math.round(Math.random() * 9000 + 1000),
    }));
  }

  if (chartType === 'table') {
    return labels.map((label) => {
      const row: Record<string, any> = { name: label };
      measures.forEach((m) => { row[m.name] = Math.round(Math.random() * 9000 + 1000); });
      dimensions.slice(1).forEach((d) => {
        const pool = DIMENSION_LABELS[d.name] ?? DIMENSION_LABELS.default;
        row[d.name] = pool[Math.floor(Math.random() * pool.length)];
      });
      return row;
    });
  }

  // Bar, Column, Line, Area, Donut
  return labels.map((label) => {
    const point: Record<string, any> = { name: label };
    measures.forEach((m) => { point[m.name] = Math.round(Math.random() * 9000 + 1000); });
    return point;
  });
}

// Generate KPI values for metrics
export function generateMockKpiData(): { kpiValue: string; kpiChange: string; kpiTrend: 'up' | 'down' | 'flat' } {
  const value = Math.round(Math.random() * 900 + 100) / 10;
  const change = (Math.random() * 20 - 5).toFixed(1);
  return {
    kpiValue: `${value}M`,
    kpiChange: `${parseFloat(change) >= 0 ? '+' : ''}${change}%`,
    kpiTrend: parseFloat(change) > 0 ? 'up' : parseFloat(change) < 0 ? 'down' : 'flat',
  };
}
```

Fill in all source field definitions (sql-2 through met-6). Each SQL/Semantic source gets 4-6 measures, 3-4 dimensions, 1-2 date fields. Each metric source gets 1 measure (the metric itself, with pre-set aggregation of SUM).

- [ ] **Step 3: Add migrateWidgetTypes to canvasStorage**

In `src/app/data/canvas-storage.ts`, add a migration function and call it from `getCanvasWidgets`:

```typescript
// Add at top of file, after imports
const MIGRATION_KEY = 'data-portal-widget-types-migrated';

function migrateWidgetTypes(): void {
  if (localStorage.getItem(MIGRATION_KEY)) return;
  const canvases: Canvas[] = JSON.parse(localStorage.getItem(CANVASES_KEY) ?? '[]');
  for (const canvas of canvases) {
    const widgetsRaw = localStorage.getItem(WIDGETS_KEY_PREFIX + canvas.id);
    if (!widgetsRaw) continue;
    const widgets = JSON.parse(widgetsRaw) as any[];
    let changed = false;
    for (const w of widgets) {
      if (w.type === 'bar') { w.type = 'column'; changed = true; }
      if (w.type === 'pie') { w.type = 'donut'; changed = true; }
    }
    if (changed) {
      localStorage.setItem(WIDGETS_KEY_PREFIX + canvas.id, JSON.stringify(widgets));
    }
  }
  localStorage.setItem(MIGRATION_KEY, 'true');
}
```

Update `getCanvasWidgets` to call `migrateWidgetTypes()` at the start:

```typescript
getCanvasWidgets(canvasId: string): WidgetConfig[] {
  migrateWidgetTypes();
  const raw = localStorage.getItem(WIDGETS_KEY_PREFIX + canvasId);
  return raw ? JSON.parse(raw) : [];
},
```

- [ ] **Step 4: Verify the app still builds**

Run: `npm run build`
Expected: Build succeeds. The `ChartType` union still includes `'pie'` so all existing references compile. `'pie'` will be removed from the union in Task 8 after all usages are migrated.

- [ ] **Step 5: Commit**

```bash
git add src/types/artifacts.ts src/app/data/mock/chart-builder-data.ts src/app/data/canvas-storage.ts
git commit -m "feat: add chart builder types, mock data, and widget type migration"
```

---

## Task 2: Source Tab Bar + Source List Components

**Files:**
- Create: `src/app/components/chart-builder/source-tab-bar.tsx`
- Create: `src/app/components/chart-builder/source-list.tsx`

- [ ] **Step 1: Create SourceTabBar component**

`src/app/components/chart-builder/source-tab-bar.tsx`:

```typescript
import styled from 'styled-components';
import { Zap, Layers, BarChart3, type LucideIcon } from 'lucide-react';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';

type SourceTab = 'sql' | 'semantic' | 'metrics';

interface SourceTabBarProps {
  activeTab: SourceTab;
  onTabChange: (tab: SourceTab) => void;
}

const TABS: { id: SourceTab; label: string; icon: LucideIcon }[] = [
  { id: 'sql', label: 'SQL', icon: Zap },
  { id: 'semantic', label: 'Semantic', icon: Layers },
  { id: 'metrics', label: 'Metrics', icon: BarChart3 },
];

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: ${Theme.usage.space.small} ${Theme.usage.space.xSmall};
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  color: ${(p) => (p.$active ? colors.ddPrimary : colors.mutedForeground)};
  background: none;
  border: none;
  border-bottom: 2px solid ${(p) => (p.$active ? colors.ddPrimary : 'transparent')};
  cursor: pointer;
  transition: color 150ms, border-color 150ms;

  &:hover {
    color: ${(p) => (p.$active ? colors.ddPrimary : colors.foreground)};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export function SourceTabBar({ activeTab, onTabChange }: SourceTabBarProps) {
  return (
    <TabBar>
      {TABS.map((tab) => (
        <Tab key={tab.id} $active={activeTab === tab.id} onClick={() => onTabChange(tab.id)}>
          <tab.icon />
          {tab.label}
        </Tab>
      ))}
    </TabBar>
  );
}

export type { SourceTab };
```

- [ ] **Step 2: Create SourceList component**

`src/app/components/chart-builder/source-list.tsx`:

```typescript
import { useState } from 'react';
import styled from 'styled-components';
import { Search, Database } from 'lucide-react';
import { Theme } from '@doordash/prism-react';
import { colors, radius } from '@/styles/theme';
import type { SourceItem } from '@/app/data/mock/chart-builder-data';

interface SourceListProps {
  sources: SourceItem[];
  selectedSourceId: string | null;
  onSourceSelect: (source: SourceItem) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SearchWrapper = styled.div`
  position: relative;
  padding: ${Theme.usage.space.xSmall};
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: ${colors.mutedForeground};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 8px 8px 32px;
  font-size: ${Theme.usage.fontSize.xSmall};
  background: rgb(var(--app-overlay-rgb) / 0.06);
  border: 1px solid ${colors.border};
  border-radius: ${radius.md};
  color: ${colors.foreground};
  outline: none;

  &::placeholder { color: ${colors.mutedForeground}; }
  &:focus { border-color: ${colors.ddPrimary}; }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 200px;
  padding: 0 ${Theme.usage.space.xSmall};
`;

const SourceRow = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  padding: 8px 10px;
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${(p) => (p.$active ? colors.ddPrimary : colors.foreground)};
  background: ${(p) => (p.$active ? 'rgb(var(--app-overlay-rgb) / 0.08)' : 'none')};
  border: none;
  border-radius: ${radius.md};
  cursor: pointer;
  text-align: left;
  width: 100%;

  &:hover {
    background: rgb(var(--app-overlay-rgb) / 0.06);
  }

  svg { width: 14px; height: 14px; color: ${colors.mutedForeground}; flex-shrink: 0; }
`;

const SourceInfo = styled.div`
  min-width: 0;
`;

const SourceName = styled.div`
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SourceDesc = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export function SourceList({ sources, selectedSourceId, onSourceSelect }: SourceListProps) {
  const [search, setSearch] = useState('');
  const filtered = sources.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container>
      <SearchWrapper>
        <SearchIcon />
        <SearchInput placeholder="Search sources..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </SearchWrapper>
      <List>
        {filtered.map((source) => (
          <SourceRow key={source.id} $active={source.id === selectedSourceId} onClick={() => onSourceSelect(source)}>
            <Database />
            <SourceInfo>
              <SourceName>{source.name}</SourceName>
              <SourceDesc>{source.description}</SourceDesc>
            </SourceInfo>
          </SourceRow>
        ))}
      </List>
    </Container>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds (these are new unused files, no errors expected).

- [ ] **Step 4: Commit**

```bash
git add src/app/components/chart-builder/
git commit -m "feat: add SourceTabBar and SourceList components for chart builder"
```

---

## Task 3: Field Inspector Component

**Files:**
- Create: `src/app/components/chart-builder/field-inspector.tsx`

- [ ] **Step 1: Create FieldInspector component**

`src/app/components/chart-builder/field-inspector.tsx`:

This is the core field selection UI. Key behaviors:
- Three collapsible sections (Measures, Dimensions, Date Fields) with count badges
- Checkboxes for measures/dimensions, radio for date fields (single-select)
- Left-border color coding: green (#4ade80) measures, blue (#60a5fa) dimensions, yellow (#facc15) dates
- Aggregation dropdown (SUM/COUNT/AVG/MIN/MAX) appears next to selected measures
- Search input to filter fields
- Field reclassification icon (session-only, changes field's role in local state)

Props interface:
```typescript
interface FieldInspectorProps {
  fields: SourceFields;
  selectedMeasures: ChartBuilderField[];
  selectedDimensions: ChartBuilderField[];
  selectedDateField: ChartBuilderField | null;
  onMeasureToggle: (field: ChartBuilderField) => void;
  onDimensionToggle: (field: ChartBuilderField) => void;
  onDateFieldSelect: (field: ChartBuilderField | null) => void;
  onAggregationChange: (fieldId: string, agg: ChartBuilderField['aggregation']) => void;
}
```

Use styled-components following existing patterns. Collapsible sections use local `useState` booleans (default open). Each section header is a button that toggles `ChevronRight` rotation. Field rows use `<label>` wrapping a styled checkbox/radio input.

Aggregation dropdown: a small `<select>` styled inline, shown only when the measure is checked.

Search: reuse the same `SearchWrapper` / `SearchInput` pattern from `SourceList`.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/chart-builder/field-inspector.tsx
git commit -m "feat: add FieldInspector component with measures, dimensions, date field selection"
```

---

## Task 4: Formula Bar + Chart Type Library

**Files:**
- Create: `src/app/components/chart-builder/formula-bar.tsx`
- Create: `src/app/components/chart-builder/chart-type-library.tsx`

- [ ] **Step 1: Create FormulaBar component**

`src/app/components/chart-builder/formula-bar.tsx`:

Displays selected fields as color-coded removable pills:
- Green background (`rgb(var(--app-success-rgb) / 0.15)`) for measures, showing `"AGG(name)"` label
- Blue background (`rgb(var(--app-info-rgb) / 0.15)`) for dimensions
- Yellow background (`rgb(var(--app-warning-rgb) / 0.15)`) for date field
- Each pill has an `×` button that calls the appropriate remove callback
- Empty state: centered text "Select fields from the source browser"

Props:
```typescript
interface FormulaBarProps {
  measures: ChartBuilderField[];
  dimensions: ChartBuilderField[];
  dateField: ChartBuilderField | null;
  onRemoveMeasure: (fieldId: string) => void;
  onRemoveDimension: (fieldId: string) => void;
  onRemoveDateField: () => void;
}
```

- [ ] **Step 2: Create ChartTypeLibrary component**

`src/app/components/chart-builder/chart-type-library.tsx`:

Inline 4×2 grid showing 8 chart types. Each cell is a styled button with an icon and label. Active type has `border: 2px solid #FF3A00` and slight background tint.

```typescript
import { BarChart3, BarChartHorizontal, TrendingUp, AreaChart, Circle, PieChart, Hash, Table2 } from 'lucide-react';
import type { ChartType } from '@/types';

interface ChartTypeLibraryProps {
  activeType: ChartType;
  onTypeSelect: (type: ChartType) => void;
}

const CHART_TYPES: { type: ChartType; label: string; icon: LucideIcon }[] = [
  { type: 'column', label: 'Column', icon: BarChart3 },
  { type: 'bar', label: 'Bar', icon: BarChartHorizontal },
  { type: 'line', label: 'Line', icon: TrendingUp },
  { type: 'area', label: 'Area', icon: AreaChart },
  { type: 'scatter', label: 'Scatter', icon: Circle },
  { type: 'donut', label: 'Donut', icon: PieChart },
  { type: 'kpi', label: 'KPI', icon: Hash },
  { type: 'table', label: 'Table', icon: Table2 },
];
```

Grid styled with `display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;`. Each cell: 48px tall, centered icon + small label below.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/chart-builder/formula-bar.tsx src/app/components/chart-builder/chart-type-library.tsx
git commit -m "feat: add FormulaBar and ChartTypeLibrary components"
```

---

## Task 5: Chart Preview Component

**Files:**
- Create: `src/app/components/chart-builder/chart-preview.tsx`

- [ ] **Step 1: Create ChartPreview component**

`src/app/components/chart-builder/chart-preview.tsx`:

Renders a live chart preview based on selected fields and chart type. This is the largest new component.

Props:
```typescript
interface ChartPreviewProps {
  chartType: ChartType;
  data: any[];
  measures: ChartBuilderField[];
  dimensions: ChartBuilderField[];
  dateField: ChartBuilderField | null;
  kpiData?: { kpiValue: string; kpiChange: string; kpiTrend: 'up' | 'down' | 'flat' };
}
```

Rendering logic per chart type:
- **column**: `<BarChart>` with vertical `<Bar>` per measure. X-axis from dimension/date labels.
- **bar**: `<BarChart layout="vertical">` — swap XAxis/YAxis.
- **line**: `<LineChart>` with `<Line>` per measure.
- **area**: `<AreaChart>` with `<Area>` per measure, gradient fill using `<defs><linearGradient>`.
- **scatter**: `<ScatterChart>` with `<Scatter>`, requires 2+ measures. XAxis = first measure, YAxis = second.
- **donut**: `<PieChart>` with `<Pie innerRadius={60} outerRadius={90}>`, using data from first measure.
- **kpi**: Custom styled component showing `kpiValue` large, `kpiChange` with trend arrow icon, and a small sparkline.
- **table**: Styled HTML `<table>` with `<thead>` and `<tbody>`, columns from all selected fields.

Empty state: centered "Select at least one measure to preview" message.

All Recharts charts wrapped in `<ResponsiveContainer width="100%" height="100%">`.

Color palette for multiple measures: `['#FF3A00', '#4ade80', '#60a5fa', '#facc15', '#a78bfa']`.

Import Recharts components:
```typescript
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/chart-builder/chart-preview.tsx
git commit -m "feat: add ChartPreview component with 8 chart type renderers"
```

---

## Task 6: Pin to Dashboard Dialog

**Files:**
- Create: `src/app/components/chart-builder/pin-to-dashboard-dialog.tsx`

- [ ] **Step 1: Create PinToDashboardDialog component**

`src/app/components/chart-builder/pin-to-dashboard-dialog.tsx`:

A styled modal dialog with two tabs: "Existing Dashboard" and "New Dashboard".

Props:
```typescript
interface PinToDashboardDialogProps {
  open: boolean;
  onClose: () => void;
  onPin: (canvasId: string) => void;
  preSelectedDashboardId?: string | null;
}
```

**Existing Dashboard tab:**
- Loads dashboards from `canvasStorage.getCanvases()`
- Search input filters by name
- Scrollable list showing: name (bold), `domain / tier — N widget(s)` meta line
- Click to select (highlighted state), then "Pin to Dashboard" button
- Pre-selected if `preSelectedDashboardId` matches

**New Dashboard tab:**
- Name input (required)
- Domain: styled `<select>` with options: Logistics, CX, DashPass, Marketplace, Finance
- Tier: styled `<select>` with T0, T1, T2
- "Create & Pin" button — creates canvas via `canvasStorage.saveCanvas()`, then calls `onPin` with new canvas ID

Use the existing `Dialog` / `DialogContent` components from `src/app/components/ui/dialog` as the outer shell. Style tab buttons and content with styled-components.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/chart-builder/pin-to-dashboard-dialog.tsx
git commit -m "feat: add PinToDashboardDialog with existing/new dashboard tabs"
```

---

## Task 7: Chart Builder Page (Main Page Component)

**Files:**
- Create: `src/app/pages/chart-builder-page.tsx`
- Modify: `src/app/routes.tsx`

- [ ] **Step 1: Create ChartBuilderPage**

`src/app/pages/chart-builder-page.tsx`:

This is the page orchestrator. It manages all state and wires child components together.

**State:**
```typescript
const [searchParams] = useSearchParams();
const navigate = useNavigate();

const initialTab = (searchParams.get('tab') as SourceTab) ?? 'sql';
const initialSourceId = searchParams.get('source');
const dashboardId = searchParams.get('dashboard');

const [activeTab, setActiveTab] = useState<SourceTab>(initialTab);
const [selectedSource, setSelectedSource] = useState<SourceItem | null>(/* find from initialSourceId */);
const [selectedMeasures, setSelectedMeasures] = useState<ChartBuilderField[]>([]);
const [selectedDimensions, setSelectedDimensions] = useState<ChartBuilderField[]>([]);
const [selectedDateField, setSelectedDateField] = useState<ChartBuilderField | null>(null);
const [chartType, setChartType] = useState<ChartType>('column');
const [pinDialogOpen, setPinDialogOpen] = useState(false);
```

**Layout:**
```
PageContainer (full height, flex column)
  BackLink ("← Back to Dashboard" or "← Back")
  PanelsContainer (flex row, flex: 1)
    LeftPanel (flex: 1, flex column, border-right)
      SourceTabBar
      SourceList
      Divider
      FieldInspector (if source selected)
    RightPanel (flex: 1, flex column)
      FormulaBar
      ChartTypeLibrary
      ChartPreview (flex: 1)
      ActionsBar (Pin to Dashboard button)
  PinToDashboardDialog
```

**Handlers:**
- `handleSourceSelect`: sets source, resets field selections, sets default chart type (KPI for metrics tab)
- `handleTabChange`: sets tab, clears source and fields
- `handleMeasureToggle`: adds/removes from selectedMeasures with default aggregation SUM
- `handleDimensionToggle`: adds/removes from selectedDimensions
- `handleDateFieldSelect`: sets or clears single date field
- `handleAggregationChange`: updates aggregation on a measure in selectedMeasures
- `handlePin`: creates WidgetConfig from current state, saves via canvasStorage, adds layout item, shows toast, navigates

**Mock data generation:** `useMemo` that calls `generateMockChartData()` whenever measures, dimensions, dateField, or chartType changes.

**Pin handler detail:**
```typescript
function handlePin(canvasId: string) {
  const widgetId = canvasStorage.generateId();
  const sourceName = selectedSource?.name ?? 'Chart';
  const typeName = chartType.charAt(0).toUpperCase() + chartType.slice(1);

  const widget: WidgetConfig = {
    id: widgetId,
    title: `${sourceName} — ${typeName}`,
    subtitle: selectedMeasures.map((m) => `${m.aggregation ?? 'SUM'}(${m.name})`).join(', '),
    type: chartType,
    data: chartType === 'kpi' ? undefined : mockData,
    ...(chartType === 'kpi' ? generateMockKpiData() : {}),
    query: {
      sourceId: selectedSource!.id,
      sourceType: activeTab,
      measures: selectedMeasures,
      dimensions: selectedDimensions,
      dateField: selectedDateField ?? undefined,
    },
  };

  canvasStorage.saveCanvasWidget(canvasId, widget);

  // Add layout item
  const canvas = canvasStorage.getCanvas(canvasId);
  if (canvas) {
    const newLayout: CanvasLayoutItem = { widgetId, x: 0, y: Infinity, w: 6, h: 4 };
    canvasStorage.saveCanvas({ ...canvas, layout: [...canvas.layout, newLayout] });
  }

  setPinDialogOpen(false);

  // Toast with "View Dashboard" action
  const dashboardName = canvasStorage.getCanvas(canvasId)?.title ?? 'Dashboard';
  // Use Prism useToast hook (import { useToast } from '@doordash/prism-react')
  toast({
    title: `Chart pinned to '${dashboardName}'`,
    action: {
      label: 'View Dashboard →',
      onClick: () => navigate(`/dashboard/${canvasId}?highlight=${widgetId}`),
    },
  });
  // Also navigate immediately (toast action is a backup):
  navigate(`/dashboard/${canvasId}?highlight=${widgetId}`);
}
```

Style with styled-components following existing page patterns (PageContainer, GradientOverlay, glassPanel).

- [ ] **Step 2: Add route to routes.tsx**

In `src/app/routes.tsx`, add import and route:

```typescript
import { ChartBuilderPage } from './pages/chart-builder-page'

// Add to children array:
{ path: 'chart-builder', element: <ChartBuilderPage /> },
```

- [ ] **Step 3: Verify build and manual test**

Run: `npm run build`
Expected: Succeeds.

Run: `npm run dev`
Navigate to `http://localhost:5180/#/chart-builder` — page should render with the two-panel layout. Select a source, pick fields, see chart preview update live.

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/chart-builder-page.tsx src/app/routes.tsx
git commit -m "feat: add ChartBuilderPage with full field selection, preview, and pin flow"
```

---

## Task 8: Update ChartCard for New Chart Types

**Files:**
- Modify: `src/app/components/dashboard/chart-card.tsx`

- [ ] **Step 1: Add alias map and new chart type renderers**

At the top of the chart rendering logic in `chart-card.tsx`, add an alias map:

```typescript
// Alias map for backward compat with old widget types
const CHART_TYPE_ALIAS: Record<string, string> = {
  bar: 'column',  // old 'bar' was vertical bars
  pie: 'donut',   // old 'pie' was already donut-style
};

function resolveChartType(type: string): string {
  return CHART_TYPE_ALIAS[type] ?? type;
}
```

Add new Recharts imports: `ScatterChart, Scatter`

In the chart rendering switch/conditional, use `resolveChartType(widget.type)` and add cases for:
- `'column'`: existing vertical bar logic (currently the `'bar'` case)
- `'bar'`: `<BarChart layout="vertical">` with swapped XAxis/YAxis
- `'scatter'`: `<ScatterChart>` with `<Scatter>` component
- `'donut'`: existing pie logic (already uses innerRadius=45, bump to 60)
- `'table'`: styled HTML `<table>` with all data columns

Ensure existing `'line'`, `'area'`, `'kpi'` cases remain unchanged.

- [ ] **Step 2: Remove legacy `'pie'` from ChartType union**

Now that all code references to `'pie'` have been updated (chart-card uses alias map, dashboard-canvas-page uses `'donut'`), narrow the `ChartType` in `src/types/artifacts.ts`:

```typescript
export type ChartType = 'column' | 'bar' | 'line' | 'area' | 'scatter' | 'donut' | 'kpi' | 'table';
```

Run `npm run build` to verify no remaining `'pie'` references cause errors.

- [ ] **Step 3: Verify build and check existing dashboards**

Run: `npm run dev`
Open an existing dashboard — existing widgets should render correctly (bar → column alias, pie → donut alias).

- [ ] **Step 4: Commit**

```bash
git add src/app/components/dashboard/chart-card.tsx src/types/artifacts.ts
git commit -m "feat: support new chart types in ChartCard with backward-compat alias map"
```

---

## Task 9: Modify SourceBrowserPanel to Navigate to Chart Builder

**Files:**
- Modify: `src/app/components/panels/source-browser-panel.tsx`

- [ ] **Step 1: Update SQL/Semantic/Metrics tabs to be launchers**

Import `useNavigate` and `useParams` from `react-router`.

For the SQL, Semantic, and Metrics tabs:
- Remove the inline field inspector rendering for these tabs
- When a source is clicked, navigate to the chart builder:

```typescript
const navigate = useNavigate();
const { id: canvasId } = useParams();

function handleSourceClick(source: SourceItem) {
  const params = new URLSearchParams();
  params.set('source', source.id);
  params.set('tab', source.type);
  if (canvasId) params.set('dashboard', canvasId);
  navigate(`/chart-builder?${params.toString()}`);
}
```

Keep the AI-BI tab (`chat`) and Cache tab unchanged — they continue to work as before with their existing UI.

Remove `onSourceSelect` and `onChartTypeSelect` props from the component interface. Keep `onAIComplete` for the AI-BI tab.

Updated props interface:
```typescript
interface SourceBrowserPanelProps {
  onAIComplete?: (config: AIWidgetConfig) => void;
  activeTab?: SourceType;
  onTabChange?: (tab: SourceType) => void;
}
```

- [ ] **Step 2: Fix parent component references and update old type values**

In `src/app/pages/dashboard-canvas-page.tsx`:
- Remove `onSourceSelect` and `onChartTypeSelect` props from `<SourceBrowserPanel>` usage
- Update `generateMockData()` function: change `'pie'` references to `'donut'`, `'bar'` to `'column'` in the chart type logic
- Update `handleAddChartFromType` and any `chartLabels` mapping to use new type names
- Update the quick chart type buttons (if any) to use `'column'` instead of `'bar'`

- [ ] **Step 3: Verify build and manual test**

Run: `npm run dev`
Navigate to a dashboard canvas page. Click on a SQL source — should navigate to `/chart-builder` with correct query params. AI-BI tab should still work as before.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/panels/source-browser-panel.tsx src/app/pages/dashboard-canvas-page.tsx
git commit -m "feat: convert source browser SQL/Semantic/Metrics tabs to chart builder launchers"
```

---

## Task 10: Dashboard Widget Highlight Animation

**Files:**
- Modify: `src/app/pages/dashboard-canvas-page.tsx`
- Modify: `src/app/components/dashboard/canvas-grid.tsx`
- Modify: `src/app/components/dashboard/chart-card.tsx`

- [ ] **Step 1: Read highlight query param in dashboard-canvas-page**

In `dashboard-canvas-page.tsx`, read the `highlight` query param:

```typescript
import { useParams, useNavigate, useSearchParams } from 'react-router';

// Inside component:
const [searchParams, setSearchParams] = useSearchParams();
const highlightWidgetId = searchParams.get('highlight');
```

Pass `highlightWidgetId` to `CanvasGrid` and then to individual `ChartCard` components.

Also modify `src/app/components/dashboard/canvas-grid.tsx`:
- Add `highlightWidgetId?: string` to `CanvasGridProps`
- Pass `highlight={widget.id === highlightWidgetId}` to each `<ChartCard>`

- [ ] **Step 2: Add highlight animation to ChartCard**

In `chart-card.tsx`, accept an optional `highlight` prop:

```typescript
interface ChartCardProps {
  widget: WidgetConfig;
  onRemove?: (widgetId: string) => void;
  onAddFilter?: (widgetId: string) => void;
  highlight?: boolean;
}
```

Add a styled keyframe animation:

```typescript
const highlightGlow = keyframes`
  0% { box-shadow: 0 0 0 2px #FF3A00, 0 0 20px rgba(255, 58, 0, 0.3); }
  100% { box-shadow: 0 0 0 2px transparent, 0 0 0 transparent; }
`;
```

Apply to `CardContainer` conditionally:

```typescript
const CardContainer = styled.div<{ $highlight?: boolean }>`
  ${glassPanel}
  border: 1px solid ${colors.border};
  border-radius: ${radius['2xl']};
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  ${(p) => p.$highlight && `animation: ${highlightGlow} 2s ease-out forwards;`}
`;
```

Use a `useEffect` with a ref to scroll into view and clear the query param after 2s:

```typescript
const cardRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (highlight && cardRef.current) {
    cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const timer = setTimeout(() => {
      // Clear highlight param via parent callback or URL manipulation
    }, 2100);
    return () => clearTimeout(timer);
  }
}, [highlight]);
```

- [ ] **Step 3: Clear highlight param after animation**

In `dashboard-canvas-page.tsx`, after 2s timeout, clear the param:

```typescript
useEffect(() => {
  if (highlightWidgetId) {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        prev.delete('highlight');
        return prev;
      }, { replace: true });
    }, 2500);
    return () => clearTimeout(timer);
  }
}, [highlightWidgetId, setSearchParams]);
```

- [ ] **Step 4: Verify build and manual test**

Run: `npm run dev`
Navigate to `/#/dashboard/{id}?highlight={widgetId}` — the widget should scroll into view with a red glow that fades over 2 seconds.

- [ ] **Step 5: Commit**

```bash
git add src/app/pages/dashboard-canvas-page.tsx src/app/components/dashboard/chart-card.tsx
git commit -m "feat: add widget highlight animation on pin-to-dashboard navigation"
```

---

## Task 11: End-to-End Integration Test

**Files:** No new files — manual verification

- [ ] **Step 1: Full flow test**

Run: `npm run dev`

Test the complete flow:
1. Navigate to a dashboard canvas page
2. In the source browser, click a SQL source (e.g., `fact_deliveries`)
3. Verify navigation to `/chart-builder` with correct query params
4. Select 1-2 measures, 1 dimension, 1 date field
5. Verify formula bar shows colored pills
6. Switch chart types — verify preview updates
7. Click "Pin to Dashboard"
8. Select the originating dashboard (should be pre-selected)
9. Confirm pin
10. Verify navigation to dashboard with highlighted new widget
11. Verify the widget renders correctly in the grid

- [ ] **Step 2: Test backward compatibility**

Navigate to any existing dashboard. Verify existing widgets (that used old `'bar'`/`'pie'` types) still render correctly via the alias map.

- [ ] **Step 3: Test each chart type**

On the chart builder page, create a chart with each of the 8 types and verify the preview renders correctly.

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 5: Lint check**

Run: `npm run lint`
Fix any lint issues.

- [ ] **Step 6: Final commit if any fixes**

```bash
git add -A
git commit -m "fix: address integration issues from end-to-end testing"
```
