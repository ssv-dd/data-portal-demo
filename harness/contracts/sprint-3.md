# Sprint 3 Contract

## Features
- Feature 1: Pin Chart from Home Page Chat to Dashboard

## Acceptance Criteria

### Pin to Dashboard Button
1. [ ] Each chart and table section in the AnalysisResponse component displays a "Pin to Dashboard" action button alongside existing Canvas, SQL, and Notebook buttons
2. [ ] The "Pin to Dashboard" button uses a pin/dashboard icon and matches the existing action button styling

### Dashboard Picker Modal
3. [ ] Clicking "Pin to Dashboard" opens the PinToDashboardDialog modal (reuses existing component from chart-builder)
4. [ ] The picker shows all user dashboards with search, sorted by most recently edited
5. [ ] The picker includes a "New Dashboard" tab to create a new dashboard
6. [ ] Selecting a dashboard and confirming adds a new widget to that dashboard's storage (canvasStorage)

### Widget Creation
7. [ ] Pinning a chart section creates an "area" type widget with the chart title "Subscriber Growth Trend" and the chart data
8. [ ] Pinning the table section creates a "table" type widget with title "Executive Summary by Region" and the summary data
9. [ ] The new widget is added to the target dashboard's layout with a proper layout entry (widgetId, x, y, w, h)

### Toast Notification
10. [ ] A success toast appears after pinning with a message confirming the pin
11. [ ] The toast includes a clickable link/action to navigate to the dashboard

### Navigation
12. [ ] Clicking the toast link navigates to the pinned dashboard with a highlight query parameter for the new widget

## How to Verify
- Start the dev server: `npm run dev`
- Navigate to: `http://localhost:5180/#/`
- Type a question in the chat input (e.g., "Show me DashPass growth") and submit
- Wait for the analysis response to appear
- Verify the "Pin to Dashboard" button appears in the "Executive Summary by Region" section header and the "Subscriber Growth Trend" chart header
- Click "Pin to Dashboard" on either section
- Verify the dashboard picker modal opens with existing dashboards and search
- Select a dashboard and click "Pin to Dashboard" to confirm
- Verify a success toast appears
- Verify the widget was added (navigate to the dashboard to confirm)

## Out of Scope for This Sprint
- Highlighting the newly pinned widget on the dashboard (visual highlight animation)
- Real backend persistence (uses localStorage via canvasStorage)
- Feature 2: Read-only view for shared dashboards (completed in Sprint 1)
- Feature 3: Consolidate AI-BI and remove right-side chat pane (completed in Sprint 2)
