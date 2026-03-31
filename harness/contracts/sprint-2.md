# Sprint 2 Contract

## Features

- Feature A: Remove right-side AI assistant sidebar from dashboard canvas page
- Feature B: Expand canvas to fill the freed space
- Feature C: Enhance the AI-BI tab in the left panel with welcome state, suggested prompts, and chat-style UX
- Feature D: Maximize/minimize toggle works correctly with only left panel

## Acceptance Criteria

### Feature A: Remove Right-Side AI Assistant Sidebar
1. [ ] The right-side `AIAssistantSidebar` component is no longer rendered on the dashboard canvas page in editor mode
2. [ ] The `rightPanelOpen` state variable and its associated toggle logic are removed from dashboard-canvas-page.tsx
3. [ ] No visual remnant or gap exists where the right panel used to be

### Feature B: Canvas Expands to Fill Freed Space
1. [ ] The dashboard canvas area uses the full available width (only left panel + center panel, no right panel)
2. [ ] The center panel (`CenterPanel`) stretches to fill the space formerly occupied by the right sidebar
3. [ ] Widgets render correctly at the new wider canvas width

### Feature C: Enhanced AI-BI Tab in Left Panel
1. [ ] The AI-BI tab in the left panel displays a welcome message with a sparkle icon and "AI-BI Assistant" title when no conversation is active
2. [ ] The AI-BI tab shows at least 4 suggested prompt chips (e.g., "Show revenue by region", "Add a KPI for daily orders") that users can click to populate the input
3. [ ] The AI-BI tab has a chat-style text input with a send button pinned at the bottom of the panel
4. [ ] Clicking a suggested prompt chip populates the chat input with that prompt text
5. [ ] The AI-BI tab retains its existing processing flow (thought steps, question cards, chart preview, add-to-dashboard confirmation)
6. [ ] Other left panel tabs (SQL, Semantic, Metrics, Cache) continue to work unchanged
7. [ ] The AI-BI tab conversation area scrolls while the input stays fixed at the bottom

### Feature D: Maximize/Minimize Toggle
1. [ ] The maximize/minimize toggle in the top bar collapses only the left panel (no right panel to worry about)
2. [ ] Restoring from maximized mode expands only the left panel
3. [ ] The "Add Chart" button in the top bar still works and navigates to the chart builder

### Interaction with Report Mode (Sprint 1)
1. [ ] Report mode (`?shared` URL param) continues to work: no left panel, no right panel, full-width canvas
2. [ ] Clicking "Edit" in report mode restores editor mode with only the left panel (no right panel)

## How to Verify

- Start the dev server: `npm run dev`
- Navigate to: `http://localhost:5180/#/dashboard/draft` (or any existing dashboard)
- **Verify right panel removed:** No AI Assistant sidebar should appear on the right side of the page
- **Verify canvas width:** The center panel should extend from the left panel edge to the right edge of the viewport
- **Verify AI-BI tab:** Click the "AI-BI" tab in the left panel. Should see: sparkle icon, "AI-BI Assistant" title, welcome text, and 4+ suggested prompt chips
- **Verify prompt chips:** Click a suggested prompt chip — it should populate the input field
- **Verify chat input:** A text input with send button should be visible at the bottom of the AI-BI tab
- **Verify processing flow:** Type a prompt and submit — the existing thought steps, question cards, and widget creation flow should still work
- **Verify other tabs:** Click SQL, Semantic, Metrics, Cache tabs — they should render their existing content
- **Verify maximize:** Click the maximize toggle — only the left panel should collapse; click again to restore
- **Verify Add Chart:** Click "Add Chart" button in top bar — should navigate to chart builder
- **Verify report mode:** Navigate to `?shared=true` — full-width read-only view with no panels
- **Verify edit transition:** In report mode, click "Edit" — should show editor with left panel only (no right panel)

## Out of Scope for This Sprint
- Feature 1: Pin chart from home page chat to dashboard — not yet started
- Knowledge base selector in AI-BI tab (the right sidebar had one, but the left panel AI-BI tab does not need it for this sprint)
- Past conversations tab in AI-BI tab
- Real AI responses or backend integration
