# Sprint 1 Contract

## Features
- Feature A: Read-only report mode for shared dashboards
- Feature B: Edit button to switch from report mode to editor mode

## Acceptance Criteria

### Feature A: Read-Only Report Mode
1. [ ] When a dashboard URL contains the `shared` query parameter, the page opens in read-only report mode
2. [ ] In report mode, the left source panel is hidden
3. [ ] In report mode, the right AI assistant sidebar is hidden
4. [ ] In report mode, the title is displayed as plain text (not an editable input)
5. [ ] In report mode, widget drag handles, overflow menus (three-dot menu), and edit controls are hidden
6. [ ] In report mode, the "Add Chart", "Publish", and "Preview" buttons are replaced with an "Edit" button
7. [ ] Dashboard-level filters are visible in report mode but displayed as read-only chips (no add/remove controls)
8. [ ] The canvas area uses the full page width in report mode (no side panel gaps)
9. [ ] Charts, tables, and KPI cards render identically in both modes
10. [ ] Dashboard with no widgets in report mode shows a meaningful empty state ("This dashboard has no widgets yet")
11. [ ] The maximize/minimize toggle button is hidden in report mode

### Feature B: Edit Button Transition
1. [ ] An "Edit" button is visible in the top bar when in report mode
2. [ ] Clicking "Edit" switches to editor mode with all panels and controls restored
3. [ ] The "Edit" button is styled consistently with the existing top bar action buttons
4. [ ] Domain and tier badges remain visible in both report and editor modes

## How to Verify
- Start the dev server: `npm run dev`
- Navigate to: `http://localhost:5180/Data-Portal-AI-Native/#/dashboards`
- Create or open an existing dashboard
- Click "Publish" to publish the dashboard and get a share URL
- Open the share URL (contains `?shared=...` parameter) in a new tab
- Verify: The page opens in report mode — no left panel, no right panel, full-width canvas
- Verify: Title is plain text, not editable. No drag handles on widgets. No three-dot menus on widgets.
- Verify: Filter bar shows existing filters as read-only chips (no "Add filter" button, no remove X on chips)
- Verify: Top bar shows "Edit" button instead of "Add Chart" / "Publish" / "Preview"
- Click "Edit" button
- Verify: Full editor mode is restored — left panel, right panel, editable title, all action buttons

## Out of Scope for This Sprint
- Pin chart from home page chat to dashboard (Feature 1)
- Consolidate AI-BI and remove right-side chat pane (Feature 3)
- Non-owner permission checks (Edit button visibility based on ownership)
- Browser back button handling between report and edit modes
