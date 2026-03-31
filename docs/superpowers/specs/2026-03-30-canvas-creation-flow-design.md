# Canvas Creation Flow — Design Spec

**Date:** 2026-03-30
**Branch:** `pm/canvas-creation-flow`
**Status:** Draft

## Problem Statement

Three gaps in the dashboard canvas experience:

1. **No Edit option on most chart cards** — "Edit Chart" only appears when `widget.query` exists. AI-generated and default widgets never show it, leaving users unable to refine charts after creation.
2. **Preview button is non-functional** — The Preview button in the canvas top bar renders but has no click handler.
3. **AI sidebar is wizard-only** — The AI-BI panel uses a rigid multi-step wizard (metric selection → chart type). There is no free-form chat-to-chart option, and the flow resets after each widget — no continuous conversation.

## Design

### Change 1: Edit Chart — Always Available

**Goal:** Every chart card shows "Edit Chart" in its kebab menu, regardless of whether it has `query` metadata.

**Files changed:**
- `src/app/components/dashboard/chart-card.tsx`
- `src/app/pages/dashboard-canvas-page.tsx`
- `src/app/pages/chart-builder-page.tsx`

**chart-card.tsx:**
Remove the conditional guard `widget.query && onEditChart` (line 755). Replace with just `onEditChart`:

```tsx
// Before
{widget.query && onEditChart && (
  <DropdownItem onClick={() => { onEditChart(widget); setMenuOpen(false); }}>

// After
{onEditChart && (
  <DropdownItem onClick={() => { onEditChart(widget); setMenuOpen(false); }}>
```

"Edit Chart" now appears for all widgets whenever the parent provides `onEditChart`.

**dashboard-canvas-page.tsx — `handleEditChart`:**
Extend the handler to support widgets without `query`:

```typescript
const handleEditChart = useCallback((widget: WidgetConfig) => {
  if (!canvas) return;
  const params = new URLSearchParams();
  params.set('dashboard', canvas.id);
  params.set('widget', widget.id);

  if (widget.query) {
    // Existing path: full chart builder state
    params.set('source', widget.query.sourceId);
    params.set('tab', widget.query.sourceType);
  } else {
    // New path: prefill mode
    params.set('prefill', 'true');
  }

  navigate(`/chart-builder?${params.toString()}`);
}, [canvas, navigate]);
```

**chart-builder-page.tsx — prefill handling:**

The chart builder already loads an `editingWidget` when `dashboard` + `widget` params are present (lines 288-309). Currently it also reads `source` and `tab` params to set the initial selected source. In prefill mode, no `source` param is passed, so `selectedSource` initializes to `null` — the user sees the source list.

Concrete changes:
1. Read `prefill` param: `const isPrefill = searchParams.get('prefill') === 'true';`
2. When `isPrefill && editingWidget`:
   - `chartTitle` initializes from `editingWidget.title` (already works — line 327)
   - `chartType` initializes from `editingWidget.type` (already works — line 324)
   - `selectedSource` stays `null` (already works — no `source` param means `findSourceById(null)` returns `null`)
   - `selectedMeasures`, `selectedDimensions`, `selectedDateField` stay empty (already works — `editingWidget.query` is undefined)
3. The save handler (`handleSaveOrPin`, line 444) uses `selectedSource!.id` — add a guard: if `!selectedSource`, show an error toast or disable the save button. The user must pick a source before saving.
4. Since `editingWidget` is truthy, the save button shows "Save Changes" (not "Pin to Dashboard"). On save, the widget is updated in-place in canvas storage with a proper `query` property.

No new components needed. The existing chart builder UI naturally handles the "no source selected yet" state by showing the source list.

### Change 2: Preview Button — Enters Report Mode

**Goal:** Clicking "Preview" shows the dashboard in read-only report mode. Clicking "Edit" returns to edit mode.

**Files changed:**
- `src/app/components/dashboard/canvas-top-bar.tsx`
- `src/app/pages/dashboard-canvas-page.tsx`

**canvas-top-bar.tsx:**
Add `onPreview` to the props interface and wire it:

```typescript
interface CanvasTopBarProps {
  // ... existing props
  onPreview?: () => void;  // NEW
}

// In JSX:
<Button variant="outline" style={{ gap: '8px', fontSize: '13px' }} onClick={onPreview}>
  <Eye style={{ width: 14, height: 14 }} />
  Preview
</Button>
```

**dashboard-canvas-page.tsx:**
Add preview handler and pass it down:

```typescript
const handlePreview = useCallback(() => {
  setIsReportMode(true);
  setLeftPanelOpen(false);
}, []);

// In JSX:
<CanvasTopBar
  // ... existing props
  onPreview={handlePreview}
/>
```

The existing `handleEnterEditMode` already handles returning from report mode:
```typescript
const handleEnterEditMode = useCallback(() => {
  setIsReportMode(false);
  setLeftPanelOpen(true);
}, []);
```

No URL changes needed — preview is a local state toggle, distinct from the `?shared=` publish flow.

**Edge case — empty canvas**: If the user clicks Preview when there are zero widgets, the existing empty state for report mode renders: "This dashboard has no widgets yet" (lines 438-443 of dashboard-canvas-page.tsx). No special handling needed.

### Change 3: AI Sidebar — Conversational Chat + Widget Wizard

**Goal:** Transform the AI sidebar into a chat-first interface that supports both free-form chat-to-chart and the existing guided wizard flow, with continuous multi-turn conversation.

**Files changed:**
- `src/app/components/panels/ai-widget-sidebar.tsx` (major rewrite)

#### Data Model

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  /** Widget preview attached to assistant messages */
  widgetPreview?: AIWidgetConfig | null;
  /** Thought steps shown during processing */
  thoughts?: ThoughtStep[];
  /** Follow-up question with clickable options */
  question?: {
    text: string;
    options: string[];
    answered?: boolean;
    answer?: string;
  };
}

// ThoughtStep reused from existing code
interface ThoughtStep {
  id: string;
  text: string;
  status: 'processing' | 'complete';
}
```

Component state:
```typescript
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [userInput, setUserInput] = useState('');
const [isProcessing, setIsProcessing] = useState(false);
```

#### UI Structure

**Welcome state** (messages.length === 0):
- Same as current: icon, title, description, suggested prompt chips
- Input dock pinned at bottom
- Clicking a chip populates the input field (existing behavior)

**Chat state** (messages.length > 0):
- Header bar with "AI-BI Assistant" + "New Chat" button (replaces "Start Over")
- Scrollable message list
- Input dock pinned at bottom

#### Message Rendering

Each message renders based on its `role` and attached data:

| Message type | Visual | Styling |
|---|---|---|
| User message | Right-aligned text bubble | `background: rgb(var(--app-violet-rgb) / 0.06)`, `border-radius: radius['2xl']`, `padding: space.xSmall space.small`, `max-width: 85%`, `margin-left: auto` |
| Assistant text | Left-aligned text, preceded by thought steps if present | Reuses existing `ThoughtRow` + `ThoughtText` styled components |
| Widget preview | Card with add button | Reuses existing `FinalCard` styled component (green gradient border, CheckCircle2 icon, badges). "Add to Dashboard" button reuses existing `Button` with `size="sm"` |
| Question | Blue question card with clickable option buttons | Reuses existing `QuestionCard`, `QuestionHeaderRow`, `OptionButton` styled components exactly as-is |

#### Simulated AI Flows

**Free-form path** (clear intent like "show me revenue by region"):
1. User message added to chat
2. Assistant thinking message appears with animated thought steps
3. After ~2-3s, assistant message with `widgetPreview` attached:
   - AI determines chart type, title, description, category from the prompt
   - Preview card rendered inline
4. User clicks "Add to Dashboard" → `onAIComplete(config)` called, success message appended
5. Input ready for next request

**Guided path** (ambiguous intent like "track customer metrics"):
1. User message added to chat
2. Assistant thinking → assistant message with `question` attached
3. User clicks an option → option recorded as user message, triggers next round
4. Second question (chart type) → user picks → widget preview generated
5. Same add flow

**Routing logic — free-form vs. guided (keyword matching):**

The simulated AI uses keyword matching to decide which path to take. This extends the existing logic in `simulateAIProcessing`:

```typescript
function classifyIntent(input: string): 'direct' | 'guided' {
  const lower = input.toLowerCase();

  // Direct path: input contains BOTH a metric keyword AND a chart/visualization keyword
  const metricKeywords = ['revenue', 'orders', 'delivery', 'conversion', 'growth', 'kpi', 'aov', 'gov'];
  const chartKeywords = ['show', 'chart', 'graph', 'plot', 'visualize', 'trend', 'compare', 'breakdown'];

  const hasMetric = metricKeywords.some(k => lower.includes(k));
  const hasChart = chartKeywords.some(k => lower.includes(k));

  // Direct: user specified what they want clearly
  if (hasMetric && hasChart) return 'direct';

  // Guided: ambiguous — need clarification
  return 'guided';
}
```

Direct path mock generation maps keywords to widget configs:
- "revenue" → Revenue Growth Rate, line chart
- "orders" → Daily Orders, column chart
- "delivery" → Avg Delivery Time, line chart
- "conversion" → Conversion Rate, area chart
- "kpi" → infers from context, KPI card
- Default fallback → line chart with inferred title from input

Guided path reuses the existing question flow (metric selection → chart type selection), presented as chat messages instead of standalone cards.

#### Continuous Conversation

After a widget is added:
- A success message is appended: "Added '{title}' to your dashboard."
- The input dock remains active — user can immediately type another request
- All previous messages stay visible and scrollable
- "New Chat" button in header clears all messages and returns to welcome state

#### Suggested Prompts

The 6 existing prompts remain in the welcome state as a chip grid (current behavior).

**Follow-up suggestions after widget creation:**
After a widget is successfully added, the success message includes 2 small chips for common next actions. These are static per category:
- **financial**: "Add a KPI card for this metric", "Break down by region"
- **operational**: "Compare week-over-week", "Add a KPI summary"
- **customer-support**: "Show trend over time", "Add satisfaction KPI"
- **default**: "Add another chart", "Add a KPI card"

Chips are rendered as small styled buttons below the success message text. Clicking one populates the input and auto-submits.

#### Props Interface

```typescript
interface AIWidgetSidebarProps {
  onAIComplete: (config: AIWidgetConfig) => void;
}
```

No change to the props interface — the parent (`source-browser-panel.tsx`) already passes `onAIComplete`.

#### Behavioral Details

- **Input disabled during processing**: The send button and textarea are disabled when `isProcessing` is true. This prevents overlapping simulated flows.
- **Auto-scroll**: The existing `thoughtsEndRef.current?.scrollIntoView({ behavior: 'smooth' })` pattern carries over — auto-scroll to the newest message on every state update.
- **"New Chat" does not remove widgets**: Clicking "New Chat" only clears the chat message history. Widgets already added to the dashboard via `onAIComplete` persist in canvas storage.
- **Existing styled components reused**: `ThoughtRow`, `ThoughtIcon`, `ThoughtText`, `QuestionCard`, `QuestionHeaderRow`, `QuestionBubble`, `QuestionLabel`, `QuestionText`, `OptionsContainer`, `OptionButton`, `FinalCard`, `FinalHeader`, `FinalIconWrap`, `FinalBadges`, `AnswerBox` — all retained and rendered within the message list instead of as standalone sections.

## Files Summary

| File | Change scope |
|---|---|
| `chart-card.tsx` | Remove conditional guard on Edit Chart menu item |
| `dashboard-canvas-page.tsx` | Extend `handleEditChart` for prefill mode; add `handlePreview` |
| `canvas-top-bar.tsx` | Add `onPreview` prop, wire Preview button |
| `chart-builder-page.tsx` | Handle `prefill=true` param to pre-fill title/type without source |
| `ai-widget-sidebar.tsx` | Rewrite to chat-first conversational interface |

## Out of Scope

- Persisting chat history across page navigation (messages live in component state only)
- Real AI/LLM integration (all responses remain mock/simulated)
- Changes to the chart builder itself (beyond handling prefill param)
- Changes to the publish flow or share URL generation

## Success Criteria

1. Every chart card shows "Edit Chart" in kebab menu → opens chart builder with current state
2. Preview button enters read-only report mode; Edit button returns to edit mode
3. AI sidebar supports free-form chat → preview → add flow
4. AI sidebar supports existing guided wizard flow within the chat
5. Conversation continues after adding a widget — no forced reset
6. Both creation paths (chat and wizard) coexist in the same sidebar
