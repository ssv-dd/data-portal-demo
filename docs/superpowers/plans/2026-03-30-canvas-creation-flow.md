# Canvas Creation Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add always-visible Edit Chart, functional Preview button, and conversational AI chat-to-chart sidebar to the dashboard canvas.

**Architecture:** Three independent changes to the dashboard canvas experience: (1) remove the conditional guard on the Edit Chart menu item and extend chart builder to handle widgets without query metadata, (2) wire the Preview button to toggle report mode, (3) rewrite the AI sidebar from a rigid wizard to a chat-first conversational interface that supports both free-form and guided widget creation with continuous conversation.

**Tech Stack:** React 18, TypeScript, styled-components, React Router 7 (hash routing), framer-motion v6.5.1, @doordash/prism-react, Recharts

**Spec:** `docs/superpowers/specs/2026-03-30-canvas-creation-flow-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/app/components/dashboard/chart-card.tsx` | Modify | Remove `widget.query` guard on Edit Chart menu item |
| `src/app/pages/dashboard-canvas-page.tsx` | Modify | Extend `handleEditChart` for prefill; add `handlePreview`; pass `onPreview` |
| `src/app/components/dashboard/canvas-top-bar.tsx` | Modify | Add `onPreview` prop, wire Preview button onClick |
| `src/app/pages/chart-builder-page.tsx` | Modify | Handle `prefill=true` param; guard save when no source selected |
| `src/app/components/panels/ai-widget-sidebar.tsx` | Rewrite | Chat-first conversational interface with message history |

---

### Task 1: Edit Chart — Always Visible in Kebab Menu

**Files:**
- Modify: `src/app/components/dashboard/chart-card.tsx:755-763`

- [ ] **Step 1: Remove the `widget.query` guard on Edit Chart**

In `src/app/components/dashboard/chart-card.tsx`, change the conditional around the Edit Chart menu item.

Before (line 755-763):
```tsx
{widget.query && onEditChart && (
  <>
    <DropdownItem onClick={() => { onEditChart(widget); setMenuOpen(false); }}>
      <Pencil style={{ width: 14, height: 14 }} />
      Edit Chart
    </DropdownItem>
    <MenuSeparator />
  </>
)}
```

After:
```tsx
{onEditChart && (
  <>
    <DropdownItem onClick={() => { onEditChart(widget); setMenuOpen(false); }}>
      <Pencil style={{ width: 14, height: 14 }} />
      Edit Chart
    </DropdownItem>
    <MenuSeparator />
  </>
)}
```

- [ ] **Step 2: Verify the change visually**

Run: `npm run dev`

Open a dashboard with widgets that do NOT have `query` metadata (e.g., AI-generated widgets). Click the kebab (three-dot) menu. Confirm "Edit Chart" now appears for all widgets.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/dashboard/chart-card.tsx
git commit -m "feat: show Edit Chart menu item for all widgets regardless of query metadata"
```

---

### Task 2: Extend handleEditChart for Prefill Mode

**Files:**
- Modify: `src/app/pages/dashboard-canvas-page.tsx:332-340`

- [ ] **Step 1: Update handleEditChart to support widgets without query**

In `src/app/pages/dashboard-canvas-page.tsx`, replace the existing `handleEditChart` handler (lines 332-340):

Before:
```typescript
const handleEditChart = useCallback((widget: WidgetConfig) => {
  if (!canvas || !widget.query) return;
  const params = new URLSearchParams();
  params.set('source', widget.query.sourceId);
  params.set('tab', widget.query.sourceType);
  params.set('dashboard', canvas.id);
  params.set('widget', widget.id);
  navigate(`/chart-builder?${params.toString()}`);
}, [canvas, navigate]);
```

After:
```typescript
const handleEditChart = useCallback((widget: WidgetConfig) => {
  if (!canvas) return;
  const params = new URLSearchParams();
  params.set('dashboard', canvas.id);
  params.set('widget', widget.id);

  if (widget.query) {
    params.set('source', widget.query.sourceId);
    params.set('tab', widget.query.sourceType);
  } else {
    params.set('prefill', 'true');
  }

  navigate(`/chart-builder?${params.toString()}`);
}, [canvas, navigate]);
```

- [ ] **Step 2: Verify navigation works for both widget types**

Run: `npm run dev`

1. Open a dashboard with a widget that HAS `query` (created via chart builder). Click Edit Chart → should navigate to chart builder with source pre-selected.
2. Open a dashboard with a widget that LACKS `query` (AI-generated). Click Edit Chart → should navigate to chart builder with `?prefill=true`, showing the source list.

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/dashboard-canvas-page.tsx
git commit -m "feat: extend handleEditChart to support prefill mode for widgets without query"
```

---

### Task 3: Chart Builder — Handle Prefill Param

**Files:**
- Modify: `src/app/pages/chart-builder-page.tsx:296-330` (state initialization)
- Modify: `src/app/pages/chart-builder-page.tsx:444-482` (save handler)

- [ ] **Step 1: Read the prefill param**

In `src/app/pages/chart-builder-page.tsx`, after line 303 (`const editingWidgetId = searchParams.get('widget');`), add:

```typescript
const isPrefill = searchParams.get('prefill') === 'true';
```

- [ ] **Step 2: Guard the save handler when no source is selected**

In `handleSaveOrPin` (line 444), the code uses `selectedSource!.id` which will crash if no source is selected. Add a guard at the top of the callback body, right after `const isEditing = !!editingWidget;`:

```typescript
const handleSaveOrPin = useCallback(
  (canvasId: string) => {
    const isEditing = !!editingWidget;
    if (!selectedSource) return; // Guard: must select a source before saving
    const widgetId = isEditing ? editingWidget.id : canvasStorage.generateId();
```

- [ ] **Step 3: Disable save button when no source is selected in prefill mode**

Find the save/pin button rendering area in the JSX. The button that triggers `handleSaveOrPin` or `setPinDialogOpen(true)` should be disabled when `isPrefill && !selectedSource`. Look for the "Save Changes" button in the right panel and add a disabled condition:

The save button already checks `hasMeasures` (whether any measures are selected). In prefill mode with no source, `hasMeasures` is already false, so the button is already disabled. No additional change needed here — the existing `hasMeasures` guard suffices.

- [ ] **Step 4: Verify prefill mode end-to-end**

Run: `npm run dev`

1. Navigate to a dashboard with an AI-generated widget
2. Click Edit Chart → chart builder opens with title and chart type pre-filled
3. Source list is visible (no source pre-selected)
4. Select a source → field inspector appears
5. Pick measures/dimensions → chart preview updates
6. Click "Save Changes" → returns to dashboard with updated widget

- [ ] **Step 5: Commit**

```bash
git add src/app/pages/chart-builder-page.tsx
git commit -m "feat: handle prefill param in chart builder for widgets without query metadata"
```

---

### Task 4: Preview Button — Wire onClick

**Files:**
- Modify: `src/app/components/dashboard/canvas-top-bar.tsx:21-31` (props interface)
- Modify: `src/app/components/dashboard/canvas-top-bar.tsx:296` (destructure prop)
- Modify: `src/app/components/dashboard/canvas-top-bar.tsx:399-402` (button JSX)

- [ ] **Step 1: Add onPreview to CanvasTopBarProps**

In `src/app/components/dashboard/canvas-top-bar.tsx`, add `onPreview` to the props interface (line 21-31):

```typescript
interface CanvasTopBarProps {
  canvas: Canvas;
  onUpdate: (updates: Partial<Canvas>) => void;
  onAddWidget: () => void;
  onPublish: () => void;
  onPreview?: () => void;  // NEW
  maximized?: boolean;
  onToggleMaximize?: () => void;
  dashboardFilters?: DashboardFilter[];
  onDashboardFiltersChange?: (filters: DashboardFilter[]) => void;
  readOnly?: boolean;
  onEdit?: () => void;
}
```

- [ ] **Step 2: Destructure onPreview in the component**

Update the function signature (line 296):

Before:
```typescript
export function CanvasTopBar({ canvas, onUpdate, onAddWidget, onPublish, maximized = false, onToggleMaximize, dashboardFilters = [], onDashboardFiltersChange, readOnly = false, onEdit }: CanvasTopBarProps) {
```

After:
```typescript
export function CanvasTopBar({ canvas, onUpdate, onAddWidget, onPublish, onPreview, maximized = false, onToggleMaximize, dashboardFilters = [], onDashboardFiltersChange, readOnly = false, onEdit }: CanvasTopBarProps) {
```

- [ ] **Step 3: Wire the Preview button**

Replace the Preview button JSX (lines 399-402):

Before:
```tsx
<Button variant="outline" style={{ gap: '8px', fontSize: '13px' }}>
  <Eye style={{ width: 14, height: 14 }} />
  Preview
</Button>
```

After:
```tsx
<Button variant="outline" style={{ gap: '8px', fontSize: '13px' }} onClick={onPreview}>
  <Eye style={{ width: 14, height: 14 }} />
  Preview
</Button>
```

- [ ] **Step 4: Commit**

```bash
git add src/app/components/dashboard/canvas-top-bar.tsx
git commit -m "feat: add onPreview prop and wire Preview button click handler"
```

---

### Task 5: Dashboard Canvas Page — Add Preview Handler

**Files:**
- Modify: `src/app/pages/dashboard-canvas-page.tsx` (add handler + pass prop)

- [ ] **Step 1: Add handlePreview callback**

In `src/app/pages/dashboard-canvas-page.tsx`, add the preview handler near the other handlers (after `handleEnterEditMode` around line 235):

```typescript
const handlePreview = useCallback(() => {
  setIsReportMode(true);
  setLeftPanelOpen(false);
}, []);
```

- [ ] **Step 2: Pass onPreview to CanvasTopBar**

Find the `<CanvasTopBar` JSX (around line 420) and add the `onPreview` prop:

Before:
```tsx
<CanvasTopBar
  canvas={canvas}
  onUpdate={updateCanvas}
  onAddWidget={() => navigate(`/chart-builder?dashboard=${canvas.id}`)}
  onPublish={handlePublish}
  maximized={maximized}
  onToggleMaximize={handleToggleMaximize}
  dashboardFilters={dashboardFilters}
  onDashboardFiltersChange={setDashboardFilters}
  readOnly={isReportMode}
  onEdit={handleEnterEditMode}
/>
```

After:
```tsx
<CanvasTopBar
  canvas={canvas}
  onUpdate={updateCanvas}
  onAddWidget={() => navigate(`/chart-builder?dashboard=${canvas.id}`)}
  onPublish={handlePublish}
  onPreview={handlePreview}
  maximized={maximized}
  onToggleMaximize={handleToggleMaximize}
  dashboardFilters={dashboardFilters}
  onDashboardFiltersChange={setDashboardFilters}
  readOnly={isReportMode}
  onEdit={handleEnterEditMode}
/>
```

- [ ] **Step 3: Verify Preview → Edit round-trip**

Run: `npm run dev`

1. Open a dashboard with widgets
2. Click "Preview" → dashboard enters read-only mode, left panel collapses, editing UI hidden
3. Click "Edit" → returns to edit mode, left panel expands
4. Click "Preview" on empty canvas → shows "This dashboard has no widgets yet" message

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/dashboard-canvas-page.tsx
git commit -m "feat: wire Preview button to toggle report mode on dashboard canvas"
```

---

### Task 6: AI Sidebar — Rewrite to Chat Interface (Types + State + Routing Logic)

**Files:**
- Modify: `src/app/components/panels/ai-widget-sidebar.tsx` (rewrite)

This task sets up the new data model, state, and intent classification. The next task handles the UI rendering.

- [ ] **Step 1: Replace the interfaces and state at the top of the file**

In `src/app/components/panels/ai-widget-sidebar.tsx`, replace the existing interfaces (`ThoughtStep`, `AIQuestion`, `SidebarMode`) and component state with:

```typescript
interface ThoughtStep {
  id: string;
  text: string;
  status: 'processing' | 'complete';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  widgetPreview?: AIWidgetConfig | null;
  thoughts?: ThoughtStep[];
  question?: {
    text: string;
    options: string[];
    answered?: boolean;
    answer?: string;
  };
}

// Follow-up suggestion chips by category
const FOLLOW_UP_SUGGESTIONS: Record<string, string[]> = {
  financial: ['Add a KPI card for this metric', 'Break down by region'],
  operational: ['Compare week-over-week', 'Add a KPI summary'],
  'customer-support': ['Show trend over time', 'Add satisfaction KPI'],
  default: ['Add another chart', 'Add a KPI card'],
};
```

- [ ] **Step 2: Add the intent classifier function**

Add above the component function:

```typescript
function classifyIntent(input: string): 'direct' | 'guided' {
  const lower = input.toLowerCase();
  const metricKeywords = ['revenue', 'orders', 'delivery', 'conversion', 'growth', 'kpi', 'aov', 'gov'];
  const chartKeywords = ['show', 'chart', 'graph', 'plot', 'visualize', 'trend', 'compare', 'breakdown'];
  const hasMetric = metricKeywords.some(k => lower.includes(k));
  const hasChart = chartKeywords.some(k => lower.includes(k));
  if (hasMetric && hasChart) return 'direct';
  return 'guided';
}

function generateDirectConfig(input: string): AIWidgetConfig {
  const lower = input.toLowerCase();
  if (lower.includes('orders')) return { title: 'Daily Orders', description: 'Order volume over time', category: 'operational', chartType: 'bar', metricId: 'daily-orders-ai' };
  if (lower.includes('delivery')) return { title: 'Avg Delivery Time', description: 'Mean delivery duration trend', category: 'operational', chartType: 'line', metricId: 'delivery-time-ai' };
  if (lower.includes('conversion')) return { title: 'Conversion Rate', description: 'Conversion rate trend', category: 'financial', chartType: 'area', metricId: 'conversion-rate-ai' };
  if (lower.includes('kpi')) return { title: 'Revenue KPI', description: 'Key revenue indicator', category: 'financial', chartType: 'line', metricId: 'revenue-kpi-ai' };
  // Default: revenue
  return { title: 'Revenue Growth Rate', description: 'Month-over-month revenue growth', category: 'financial', chartType: 'line', metricId: 'revenue-growth-ai' };
}
```

- [ ] **Step 3: Replace component state**

Replace the existing state declarations in the `AIWidgetSidebar` function body with:

```typescript
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [userInput, setUserInput] = useState('');
const [isProcessing, setIsProcessing] = useState(false);
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

- [ ] **Step 4: Implement handleSubmit with direct and guided flows**

Replace all existing flow functions (`simulateAIProcessing`, `handleQuestionAnswer`, `handleSecondQuestionAnswer`, `handleSubmit`, `handleAddWidget`, `resetState`) with:

```typescript
const handleNewChat = useCallback(() => {
  setMessages([]);
  setUserInput('');
  setIsProcessing(false);
}, []);

const handleAddWidget = useCallback((config: AIWidgetConfig) => {
  onAIComplete(config);
  const category = config.category || 'default';
  const suggestions = FOLLOW_UP_SUGGESTIONS[category] || FOLLOW_UP_SUGGESTIONS.default;
  setMessages((prev) => [...prev, {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: `Added "${config.title}" to your dashboard.`,
    timestamp: Date.now(),
    question: undefined,
    widgetPreview: undefined,
    thoughts: undefined,
  }, {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: '_suggestions_',
    timestamp: Date.now(),
    question: { text: '', options: suggestions, answered: false },
  }]);
}, [onAIComplete]);

const runDirectFlow = useCallback(async (input: string) => {
  setIsProcessing(true);
  const thinkingId = crypto.randomUUID();

  // Add thinking message
  setMessages((prev) => [...prev, {
    id: thinkingId,
    role: 'assistant',
    content: '',
    timestamp: Date.now(),
    thoughts: [
      { id: '1', text: 'Analyzing your request...', status: 'processing' },
    ],
  }]);

  await new Promise(r => setTimeout(r, 800));
  setMessages((prev) => prev.map((m) => m.id === thinkingId ? {
    ...m,
    thoughts: [
      { id: '1', text: 'Analyzing your request...', status: 'complete' },
      { id: '2', text: 'Searching available metrics and data sources...', status: 'processing' },
    ],
  } : m));

  await new Promise(r => setTimeout(r, 1200));
  setMessages((prev) => prev.map((m) => m.id === thinkingId ? {
    ...m,
    thoughts: [
      { id: '1', text: 'Analyzing your request...', status: 'complete' },
      { id: '2', text: 'Searching available metrics and data sources...', status: 'complete' },
      { id: '3', text: 'Generating widget configuration...', status: 'processing' },
    ],
  } : m));

  await new Promise(r => setTimeout(r, 1000));
  const config = generateDirectConfig(input);

  // Replace thinking with result
  setMessages((prev) => prev.map((m) => m.id === thinkingId ? {
    ...m,
    content: `Here's a ${config.chartType} chart for "${config.title}":`,
    thoughts: m.thoughts?.map((t) => ({ ...t, status: 'complete' as const })),
    widgetPreview: config,
  } : m));

  setIsProcessing(false);
}, []);

const runGuidedFlow = useCallback(async (input: string) => {
  setIsProcessing(true);
  const thinkingId = crypto.randomUUID();

  setMessages((prev) => [...prev, {
    id: thinkingId,
    role: 'assistant',
    content: '',
    timestamp: Date.now(),
    thoughts: [
      { id: '1', text: 'Analyzing your request...', status: 'processing' },
    ],
  }]);

  await new Promise(r => setTimeout(r, 800));
  setMessages((prev) => prev.map((m) => m.id === thinkingId ? {
    ...m,
    thoughts: [
      { id: '1', text: 'Analyzing your request...', status: 'complete' },
      { id: '2', text: 'Found multiple relevant metrics. Asking for clarification...', status: 'complete' },
    ],
  } : m));

  await new Promise(r => setTimeout(r, 600));

  const lower = input.toLowerCase();
  const isDelivery = lower.includes('delivery') || lower.includes('dasher') || lower.includes('efficiency');
  const isCustomer = lower.includes('customer') || lower.includes('satisfaction') || lower.includes('support');

  let options: string[];
  if (isDelivery) {
    options = ['Average Delivery Time (speed focus)', 'Dasher Efficiency Score (performance)', 'Order Accuracy Rate (quality)'];
  } else if (isCustomer) {
    options = ['Customer Satisfaction Score (CSAT)', 'Average Resolution Time (support speed)', 'Customer Service Call Rate'];
  } else {
    options = ['Revenue Growth Rate (month-over-month)', 'Gross Order Revenue (total revenue)', 'Average Order Value (per transaction)'];
  }

  // Replace thinking with question
  setMessages((prev) => prev.map((m) => m.id === thinkingId ? {
    ...m,
    content: 'I found several related metrics.',
    thoughts: m.thoughts?.map((t) => ({ ...t, status: 'complete' as const })),
    question: {
      text: 'Which metric would you like to track?',
      options,
      answered: false,
    },
  } : m));

  setIsProcessing(false);
}, []);

const handleQuestionAnswer = useCallback(async (messageId: string, answer: string) => {
  // Mark question as answered
  setMessages((prev) => prev.map((m) => m.id === messageId && m.question ? {
    ...m,
    question: { ...m.question, answered: true, answer },
  } : m));

  // Add user answer as a message
  setMessages((prev) => [...prev, {
    id: crypto.randomUUID(),
    role: 'user',
    content: answer,
    timestamp: Date.now(),
  }]);

  // Check if this is the first question (metric) or second (chart type)
  const msg = messages.find((m) => m.id === messageId);
  const isChartTypeQuestion = msg?.question?.options?.some((o) => o.includes('chart'));

  if (isChartTypeQuestion) {
    // Second question answered → generate widget
    setIsProcessing(true);
    const resultId = crypto.randomUUID();
    setMessages((prev) => [...prev, {
      id: resultId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      thoughts: [{ id: '1', text: 'Configuring widget...', status: 'processing' }],
    }]);

    await new Promise(r => setTimeout(r, 1000));

    let chartType: 'line' | 'area' | 'bar' = 'line';
    if (answer.includes('Bar')) chartType = 'bar';
    else if (answer.includes('Area')) chartType = 'area';

    // Find the metric answer from a previous question
    const metricMsg = messages.find((m) => m.question?.answered && !m.question.options?.some((o) => o.includes('chart')));
    const metricAnswer = metricMsg?.question?.answer || '';

    let config: AIWidgetConfig;
    if (metricAnswer.includes('Revenue Growth')) config = { title: 'Revenue Growth Rate', description: 'Month-over-month revenue growth', category: 'financial', chartType, metricId: 'revenue-growth-ai' };
    else if (metricAnswer.includes('Gross Order')) config = { title: 'Gross Order Revenue', description: 'Total revenue from all orders', category: 'financial', chartType, metricId: 'gross-revenue-ai' };
    else if (metricAnswer.includes('Average Order')) config = { title: 'Average Order Value', description: 'Mean revenue per order', category: 'financial', chartType, metricId: 'aov-ai' };
    else if (metricAnswer.includes('Delivery Time')) config = { title: 'Average Delivery Time', description: 'Mean time from order to delivery', category: 'operational', chartType, metricId: 'delivery-time-ai' };
    else if (metricAnswer.includes('Dasher')) config = { title: 'Dasher Efficiency Score', description: 'Delivery performance rating', category: 'operational', chartType, metricId: 'dasher-efficiency-ai' };
    else if (metricAnswer.includes('Satisfaction')) config = { title: 'Customer Satisfaction Score', description: 'Overall CSAT rating', category: 'customer-support', chartType, metricId: 'csat-ai' };
    else config = { title: 'Revenue Growth Rate', description: 'Month-over-month revenue growth', category: 'financial', chartType, metricId: 'revenue-growth-ai' };

    setMessages((prev) => prev.map((m) => m.id === resultId ? {
      ...m,
      content: `Here's a ${config.chartType} chart for "${config.title}":`,
      thoughts: [{ id: '1', text: 'Configuring widget...', status: 'complete' }],
      widgetPreview: config,
    } : m));

    setIsProcessing(false);
  } else {
    // First question answered → ask chart type
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 600));

    setMessages((prev) => [...prev, {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Great choice!',
      timestamp: Date.now(),
      question: {
        text: 'Which chart type would you prefer?',
        options: ['Line chart — trends over time', 'Bar chart — comparisons', 'Area chart — magnitude & volume'],
        answered: false,
      },
    }]);

    setIsProcessing(false);
  }
}, [messages]);

const handleSubmit = useCallback(() => {
  const trimmed = userInput.trim();
  if (!trimmed || isProcessing) return;

  // Add user message
  setMessages((prev) => [...prev, {
    id: crypto.randomUUID(),
    role: 'user',
    content: trimmed,
    timestamp: Date.now(),
  }]);
  setUserInput('');

  const intent = classifyIntent(trimmed);
  if (intent === 'direct') {
    runDirectFlow(trimmed);
  } else {
    runGuidedFlow(trimmed);
  }
}, [userInput, isProcessing, runDirectFlow, runGuidedFlow]);

const handleSuggestionClick = useCallback((suggestion: string) => {
  setUserInput(suggestion);
  // Auto-submit after a tick so the input is visible briefly
  setTimeout(() => {
    setMessages((prev) => [...prev, {
      id: crypto.randomUUID(),
      role: 'user',
      content: suggestion,
      timestamp: Date.now(),
    }]);
    const intent = classifyIntent(suggestion);
    if (intent === 'direct') {
      runDirectFlow(suggestion);
    } else {
      runGuidedFlow(suggestion);
    }
    setUserInput('');
  }, 100);
}, [runDirectFlow, runGuidedFlow]);
```

- [ ] **Step 5: Commit types, state, and logic (no UI yet)**

This is a large change. Commit the logic layer before wiring up the UI:

```bash
git add src/app/components/panels/ai-widget-sidebar.tsx
git commit -m "feat: rewrite AI sidebar with chat data model, intent classifier, and flow logic"
```

---

### Task 7: AI Sidebar — Chat UI Rendering

**Files:**
- Modify: `src/app/components/panels/ai-widget-sidebar.tsx` (continue rewrite — UI layer)

- [ ] **Step 1: Add the UserBubble styled component**

Add this with the other styled components in the file:

```typescript
const UserBubble = styled.div`
  background: rgb(var(--app-violet-rgb) / 0.06);
  border-radius: ${radius['2xl'] ?? '16px'};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
  max-width: 85%;
  margin-left: auto;
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
  line-height: 1.4;
`;

const NewChatButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  color: ${colors.mutedForeground};
  padding: 2px 6px;
  border-radius: ${radius.sm};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;

  &:hover {
    color: ${colors.foreground};
    background: rgb(var(--app-overlay-rgb) / 0.06);
  }
`;

const SuggestionChip = styled.button`
  padding: 4px 10px;
  border-radius: ${radius.md};
  border: 1px solid rgb(var(--app-overlay-rgb) / 0.08);
  background: rgb(var(--app-surface-rgb) / 0.5);
  color: ${colors.mutedForeground};
  font-size: 11px;
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    border-color: rgb(var(--app-violet-rgb) / 0.15);
    color: ${colors.foreground};
  }
`;

const SuggestionRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: ${Theme.usage.space.xxSmall};
`;

const SuccessText = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.green600};
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1.4;
`;
```

- [ ] **Step 2: Replace the component return JSX**

Replace the entire return block (both the `if (mode === 'input')` and the processing mode return) with:

```tsx
// Welcome state
if (messages.length === 0) {
  return (
    <Container>
      <WelcomeArea>
        <WelcomeIconBox>
          <Sparkles style={{ width: 22, height: 22, color: colors.violet600 }} />
        </WelcomeIconBox>
        <WelcomeTitle>AI-BI Assistant</WelcomeTitle>
        <WelcomeDescription>
          Describe the chart or metric you need and I'll build it for your dashboard.
        </WelcomeDescription>
        <PromptChipGrid>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <PromptChip key={idx} onClick={() => setUserInput(prompt)}>
              {prompt}
            </PromptChip>
          ))}
        </PromptChipGrid>
      </WelcomeArea>

      <InputDock>
        <ChatInputWrapper>
          <ChatTextarea
            placeholder="Describe the widget you want to create..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <ChatInputFooter>
            <SendButton $active={!!userInput.trim()} onClick={handleSubmit}>
              <ArrowUp />
            </SendButton>
          </ChatInputFooter>
        </ChatInputWrapper>
      </InputDock>
    </Container>
  );
}

// Chat state
return (
  <Container>
    <Header>
      <HeaderIcon><Sparkles /></HeaderIcon>
      <HeaderTitle>AI-BI Assistant</HeaderTitle>
      <NewChatButton onClick={handleNewChat}>
        <RotateCcw style={{ width: 12, height: 12 }} />
        New Chat
      </NewChatButton>
    </Header>

    <ThoughtStream style={{ padding: Theme.usage.space.small }}>
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* User message */}
            {msg.role === 'user' && (
              <UserBubble>{msg.content}</UserBubble>
            )}

            {/* Assistant message */}
            {msg.role === 'assistant' && (
              <div>
                {/* Thought steps */}
                {msg.thoughts && msg.thoughts.map((step) => (
                  <ThoughtRow key={step.id}>
                    <ThoughtIcon>
                      {step.status === 'processing' ? (
                        <Loader2 style={{ height: 14, width: 14, color: colors.primary, animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <CheckCircle2 style={{ height: 14, width: 14, color: colors.green600 }} />
                      )}
                    </ThoughtIcon>
                    <ThoughtText>{step.text}</ThoughtText>
                  </ThoughtRow>
                ))}

                {/* Text content */}
                {msg.content && msg.content !== '_suggestions_' && !msg.widgetPreview && !msg.question && (
                  <SuccessText>
                    <CheckCircle2 style={{ height: 14, width: 14 }} />
                    {msg.content}
                  </SuccessText>
                )}

                {/* Assistant text before widget preview */}
                {msg.content && msg.widgetPreview && (
                  <ThoughtText style={{ marginBottom: Theme.usage.space.xxSmall }}>{msg.content}</ThoughtText>
                )}

                {/* Widget preview card */}
                {msg.widgetPreview && (
                  <FinalCard>
                    <FinalHeader>
                      <FinalIconWrap>
                        <CheckCircle2 style={{ height: 14, width: 14, color: colors.white }} />
                      </FinalIconWrap>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: 2 }}>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>Widget Ready</span>
                          <Sparkles style={{ height: 12, width: 12, color: colors.green600 }} />
                        </div>
                        <p style={{ fontSize: '11px', color: colors.mutedForeground, lineHeight: 1.4 }}>
                          {msg.widgetPreview.description}
                        </p>
                        <FinalBadges>
                          <Badge variant="secondary" style={{ fontSize: '10px' }}>{msg.widgetPreview.title}</Badge>
                          <Badge variant="outline" style={{ fontSize: '10px' }}>{msg.widgetPreview.chartType} chart</Badge>
                        </FinalBadges>
                      </div>
                    </FinalHeader>
                    <div style={{ marginTop: Theme.usage.space.xSmall }}>
                      <Button
                        size="sm"
                        onClick={() => handleAddWidget(msg.widgetPreview!)}
                        style={{ gap: '4px', fontSize: '12px', width: '100%' }}
                      >
                        <CheckCircle2 style={{ height: 12, width: 12 }} />
                        Add to Dashboard
                      </Button>
                    </div>
                  </FinalCard>
                )}

                {/* Question card */}
                {msg.question && msg.question.text && (
                  <QuestionCard>
                    <QuestionHeaderRow>
                      <QuestionBubble>
                        <MessageCircle style={{ height: 12, width: 12, color: colors.white }} />
                      </QuestionBubble>
                      <div style={{ flex: 1 }}>
                        <QuestionLabel>AI Assistant</QuestionLabel>
                        <QuestionText>{msg.question.text}</QuestionText>
                      </div>
                    </QuestionHeaderRow>

                    {msg.question.answered ? (
                      <AnswerBox>
                        <CheckCircle2 style={{ height: 14, width: 14, color: colors.green600, flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: '12px' }}>{msg.question.answer}</span>
                      </AnswerBox>
                    ) : (
                      <OptionsContainer>
                        {msg.question.options.map((option, optIndex) => (
                          <OptionButton
                            key={optIndex}
                            $disabled={isProcessing}
                            disabled={isProcessing}
                            onClick={() => handleQuestionAnswer(msg.id, option)}
                          >
                            <ArrowRight />
                            <OptionText>{option}</OptionText>
                          </OptionButton>
                        ))}
                      </OptionsContainer>
                    )}
                  </QuestionCard>
                )}

                {/* Follow-up suggestion chips */}
                {msg.content === '_suggestions_' && msg.question && !msg.question.answered && (
                  <SuggestionRow>
                    {msg.question.options.map((s, i) => (
                      <SuggestionChip key={i} onClick={() => handleSuggestionClick(s)}>
                        {s}
                      </SuggestionChip>
                    ))}
                  </SuggestionRow>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </ThoughtStream>

    <InputDock>
      <ChatInputWrapper>
        <ChatTextarea
          placeholder="Ask for another chart or metric..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={isProcessing}
        />
        <ChatInputFooter>
          <SendButton $active={!!userInput.trim() && !isProcessing} onClick={handleSubmit}>
            <ArrowUp />
          </SendButton>
        </ChatInputFooter>
      </ChatInputWrapper>
    </InputDock>
  </Container>
);
```

- [ ] **Step 3: Clean up unused imports and styled components**

Remove any imports or styled components no longer used after the rewrite:
- Remove `SidebarMode` type (replaced by messages.length check)
- Remove `AIQuestion` interface (replaced by ChatMessage.question)
- Remove `ActionRow` styled component (no longer used — replaced by InputDock in chat state)
- Keep `QueryBadge` only if used (likely removable)

Verify no TypeScript errors: `npx tsc --noEmit`

- [ ] **Step 4: Verify the full chat flow**

Run: `npm run dev`

1. Open a dashboard → left panel → AI-BI tab
2. See welcome state with prompt chips
3. Type "show me revenue trend" → direct flow → widget preview card appears
4. Click "Add to Dashboard" → widget added, success message, follow-up chips appear
5. Click a follow-up chip or type another request → conversation continues
6. Type "track customer metrics" → guided flow → question card appears
7. Pick a metric → chart type question → pick type → widget preview
8. Add widget → conversation continues
9. Click "New Chat" → returns to welcome state

- [ ] **Step 5: Commit the UI rewrite**

```bash
git add src/app/components/panels/ai-widget-sidebar.tsx
git commit -m "feat: rewrite AI sidebar with conversational chat UI, free-form and guided flows"
```

---

### Task 8: Build Verification

- [ ] **Step 1: Run the linter**

```bash
npm run lint
```

Fix any lint errors.

- [ ] **Step 2: Run the build**

```bash
npm run build
```

Fix any TypeScript or build errors.

- [ ] **Step 3: Run Playwright tests**

Start the dev server if not running, then:

```bash
npx playwright test
```

Fix any failing tests.

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address lint and build issues from canvas creation flow changes"
```
