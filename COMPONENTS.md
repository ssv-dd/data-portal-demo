# Component Copy-Paste Guide

This guide helps the dev team copy individual components or component groups from this prototype repo into their own projects.

## Prerequisites

All components require:
- **React 18.x or 19.x**
- **TypeScript 5.5+**
- **Tailwind CSS v4** with the theme variables from `src/styles/theme.css`

Shared utility dependencies (install once):
```bash
npm install clsx tailwind-merge class-variance-authority lucide-react
```

## Directory Structure

```
src/
  types/                    # Portable type definitions (copy what you need)
  config/app.config.ts      # Brand config (colors, user, URLs, feature flags)
  app/
    components/
      ui/                   # 19 Radix-based UI primitives
        index.ts            # Barrel export
      index.ts              # Barrel export for feature components
    data/
      mock/                 # Mock data files (replace with your API)
    pages/                  # Page compositions
  styles/
    theme.css               # Tailwind v4 theme + DoorDash design tokens
```

## UI Primitives (`src/app/components/ui/`)

Radix UI-based design system primitives. Copy the entire `ui/` folder for full coverage, or pick individual components.

### Files to copy
All files in `src/app/components/ui/`

### Required dependencies
```bash
npm install @radix-ui/react-collapsible @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-progress \
  @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator \
  @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-tooltip \
  sonner class-variance-authority clsx tailwind-merge
```

### Components included
Badge, Button, Card, Collapsible, Dialog, DropdownMenu, Input, Label, Popover, Progress, ScrollArea, Select, Separator, Sheet, Switch, Tabs, Textarea, Toaster (Sonner), Tooltip

### Required theme
Copy `src/styles/theme.css` — contains CSS variables used by all UI primitives.

---

## Executive Scorecard

Full-featured executive metrics scorecard with AI summaries, metric tables, sparklines, and drill-down modals.

### Files to copy
- `src/app/components/ExecutiveScorecard.tsx` (orchestrator, ~170 lines)
- `src/app/components/scorecard/` (sub-components):
  - `ScorecardContextBar.tsx` — product area selector + time range
  - `AIExecutiveSummary.tsx` — AI overview with highlights, concerns, sources
  - `MetricTable.tsx` — collapsible metric table per area
  - `Sparkline.tsx` — reusable SVG sparkline chart
  - `FeatureBadge.tsx` — dismissible feature announcement
  - `index.ts` — barrel export
- `src/app/components/ScorecardCustomization.tsx`
- `src/app/components/MetricDetailModal.tsx`
- `src/app/components/AIOverviewSection.tsx`
- `src/app/components/AIOverviewSettingsModal.tsx`
- `src/app/components/TextSelectionToolbar.tsx`
- `src/app/components/AskAIPromptModal.tsx`
- `src/app/components/CommentModal.tsx`
- `src/types/metrics.ts`
- `src/types/ai.ts`

### Mock data (replace with your API)
- `src/app/data/mock/scorecard-data.ts` (product areas, AI summaries)
- `src/app/data/mock/customization-data.ts` (metric options by area)
- `src/app/data/mock/metric-detail-data.ts` (detailed analysis data)
- `src/app/data/mock/ai-overview-data.ts` (AI response generator)
- `src/app/data/mock/collaboration-data.ts` (team members for @mentions)

### Required dependencies
```bash
npm install @radix-ui/react-collapsible @radix-ui/react-dialog @radix-ui/react-popover \
  @radix-ui/react-tabs @radix-ui/react-switch @radix-ui/react-tooltip \
  recharts motion sonner lucide-react
```

### Required UI primitives
Card, Badge, Button, Dialog, Tabs, Input, Switch, Popover, Tooltip, Collapsible, ScrollArea, Separator

### Props
```typescript
interface ExecutiveScorecardProps {
  onTimeRangeChange?: (range: string) => void;
  onOpenChat?: (query: string, context?: string) => void;
  userRole?: UserRole;
}
```

---

## AI Assistant Sidebar

Collapsible chat sidebar with suggestion chips, used on most pages.

### Files to copy
- `src/app/components/ai-assistant-sidebar.tsx`
- `src/types/ai.ts` (SuggestionChip, AIAssistantSidebarProps)

### Required dependencies
```bash
npm install motion lucide-react
```

### Required UI primitives
Button, Input, ScrollArea

### Props
```typescript
interface AIAssistantSidebarProps {
  title?: string;
  welcomeMessage?: string;
  suggestions?: SuggestionChip[];
}
```

---

## Analysis Response

Rich analysis display with charts, tables, key takeaways, and next-step suggestions.

### Files to copy
- `src/app/components/analysis-response.tsx`

### Mock data
- `src/app/data/mock/analysis-data.ts` (chartData, summaryData)

### Required dependencies
```bash
npm install recharts lucide-react
```

### Required UI primitives
Button

### Props
```typescript
interface AnalysisResponseProps {
  chartData: { date: string; subscribers: number; target: number }[];
  summaryData: { region: string; subs: string; growth: string; retention: string; aov: string; trend: 'up' | 'down' }[];
}
```

---

## Golden Dashboard Card

Dashboard card with mini chart (area, line, or bar) used in the home page discovery section.

### Files to copy
- `src/app/components/GoldenDashboardCard.tsx`
- `src/types/artifacts.ts` (GoldenDashboard, GoldenDashboardCardProps)

### Required dependencies
```bash
npm install recharts lucide-react
```

### Required UI primitives
Card, Badge

---

## Dashboard Canvas

Drag-and-drop dashboard builder with KPI cards, charts, and a publish flow.

### Files to copy
- `src/app/pages/dashboard-canvas-page.tsx`
- `src/app/data/mock/dashboard-canvas-data.ts`
- `src/types/artifacts.ts` (WidgetConfig)

### Required dependencies
```bash
npm install recharts lucide-react
```

### Required UI primitives
Button, Dialog

---

## SQL Studio

Split-pane SQL editor with Monaco, catalog browser, query history, and results table.

### Files to copy
- `src/app/pages/sql-studio-page.tsx`
- `src/app/data/mock/sql-studio-data.ts`
- `src/types/artifacts.ts` (SavedQuery, QueryHistoryItem, CatalogItem)

### Required dependencies
```bash
npm install @monaco-editor/react lucide-react
```

### Required UI primitives
Button, Input

---

## Notebooks

Notebook management page with templates and scaffold modal.

### Files to copy
- `src/app/pages/notebooks-page.tsx`
- `src/app/data/mock/notebooks-data.ts`
- `src/types/artifacts.ts` (Notebook, NotebookTemplate)

### Required dependencies
```bash
npm install lucide-react
```

### Required UI primitives
Button, Input, Label, Dialog

---

## AI Workflows

Workflow automation page with status tracking, filters, and templates.

### Files to copy
- `src/app/pages/ai-workflows-page.tsx`
- `src/app/data/mock/workflows-data.ts`
- `src/types/artifacts.ts` (Workflow, WorkflowTemplate, WorkflowStatusConfig)

### Required dependencies
```bash
npm install lucide-react
```

### Required UI primitives
Button, Input

---

## My Canvas (Dashboards List)

Dashboard listing page with search, filters, and navigation to canvas editor.

### Files to copy
- `src/app/pages/my-canvas-page.tsx`
- `src/app/data/mock/canvas-data.ts`
- `src/types/artifacts.ts` (Canvas)

### Required dependencies
```bash
npm install react-router lucide-react
```

### Required UI primitives
Button, Input

---

## Layout Components

Top navigation and root layout.

### Files to copy
- `src/app/components/layout/top-nav.tsx`
- `src/app/components/layout/RootLayout.tsx`
- `src/app/components/keyboard-shortcuts-modal.tsx`

### Required dependencies
```bash
npm install react-router lucide-react motion
```

### Required UI primitives
Button, Dialog, Badge, DropdownMenu, Sheet

---

## How to Wire Up Your Own Data

Each component accepts data via props or imports from `src/app/data/mock/`. To connect to your real API:

1. Copy the mock data file and the type definitions
2. Replace the mock exports with your API call results
3. The component continues to work — same shape, real data

Example:
```typescript
// Before (mock):
import { mockCanvases } from '../data/mock/canvas-data';

// After (your API):
import { useCanvases } from '../hooks/useCanvases';
const { data: mockCanvases } = useCanvases();
```

## Theme Customization

All components use CSS variables defined in `src/styles/theme.css`. To rebrand:
- Change `--dd-primary: #FF3A00` to your brand color
- All `text-dd-primary`, `bg-dd-primary`, `border-dd-primary` classes update automatically
- Recharts colors use `var(--dd-primary)` for consistency
