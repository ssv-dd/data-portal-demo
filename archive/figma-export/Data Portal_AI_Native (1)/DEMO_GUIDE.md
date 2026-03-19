# DoorDash AI-Native BI - Demo Guide

## Overview
This is a fully interactive prototype demonstrating an AI-powered Business Intelligence platform with data agent interactions, dashboard creation, SQL editing, asset verification, and telemetry monitoring.

## Features

### 🏠 Discovery Feed
- Browse all assets (SQL queries, dashboards, notebooks)
- Filter by verified/unverified status and type
- Search functionality
- Verified badges with tooltips

### 🤖 Data Agent Chat
- Natural language queries about business data
- AI returns relevant result cards with mini charts
- Pin cards to create dashboards
- Show SQL, open in SQL Studio
- Low confidence warnings
- Skeleton loading states

### 📊 Dashboard Canvas
- Auto-layout pinned cards from agent
- Interactive charts (bar, line)
- Publish modal with verification gate
- Warning for unverified metrics

### 💻 SQL Studio
- Code editor for SQL queries
- Run on sample/full data toggle
- Query results table
- Promote to Metric workflow
- Automated test results

### 📓 Notebooks
- Template-based notebook creation
- Clone existing notebooks
- Feature exploration, model eval, data quality templates

### ✅ Asset Verification
- Verification checklist
- PII scan results
- Automated test status
- Approve/reject workflow
- Direct navigation from notifications

### 📈 Telemetry Monitor
- KPI tiles (last ingest, queue length, verified assets, hallucination rate)
- Event log table
- Retrain queue management
- Trigger manual retrain

## Key Demo Flows

### Flow A: Agent → Pin → Dashboard → Publish

1. Navigate to **Agent** tab
2. Click suggested prompt: "Why did completed orders drop in SF on Mar 5?"
3. Agent returns 3 result cards
4. Click **Pin** icon on 2 different cards
5. Toast appears: "2 cards pinned — Open canvas?"
6. Click **Open Canvas**
7. Dashboard Canvas opens with auto-layout
8. Click **Publish** button
9. Modal shows verified/unverified status with warning
10. Click **Publish** → Success toast

### Flow B: Agent → SQL Studio → Promote

1. From Agent result card, click **Show SQL** icon
2. SQL modal appears with code
3. Click **Open in SQL Studio**
4. SQL Studio loads with prefilled query
5. Toggle **Run on Sample** and click **Run Query**
6. Results table displays
7. Click **Promote to Metric**
8. Fill in metric details (name, owner, tags)
9. Click **Create PR** → Success notification

### Flow C: Discovery → Notebooks

1. Navigate to **Notebooks** tab
2. View existing notebooks in grid
3. Click **New Notebook** button
4. Select template (Feature Exploration)
5. Enter notebook name and owner
6. Click **Create Notebook** → Success

### Flow D: Notifications → Verification

1. Click **Bell** icon in top nav (shows badge "2")
2. Select "Asset pending verification" notification
3. Verification panel opens
4. Review checklist items (check missing items)
5. View PII scan results (PASS)
6. View automated test results
7. Review SQL code
8. Click **Approve & Verify** → Navigate to Telemetry

### Flow E: Telemetry Monitoring

1. Navigate to **Admin** tab
2. View KPI tiles (last ingest: 6 min ago, queue: 2 items)
3. View event log table with status indicators
4. View retrain queue section
5. Click **Trigger Retrain** → Success toast

## Keyboard Shortcuts

- Press **?** to show keyboard shortcuts modal
- **/** - Focus search (planned)
- **P** - Pin card (planned)
- **Ctrl/Cmd + Enter** - Run SQL in Studio (planned)

## Design System

### Colors
- Primary: `#FF3A00` (DoorDash Red)
- Gray-900: `#1a1a1a` (Text)
- Gray-700: `#4a4a4a` (Muted)
- Gray-100: `#f3f4f6` (Cards)
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`

### Spacing
- Base unit: 8px grid

### Border Radius
- Cards: 8px
- Buttons: 6px

### Components
- Top Navigation with tabs
- Left Rail sidebar
- Result Cards with mini charts
- Dashboard Cards
- Verified/Unverified badges
- Action chips
- Modals (Publish, Promote, Scaffold)
- Toast notifications
- Skeleton loaders
- Confidence banners
- Error states

## Technical Stack

- **React 18** with TypeScript
- **React Router 7** (Data mode)
- **Tailwind CSS v4**
- **Recharts** for visualizations
- **Lucide React** for icons
- **Radix UI** for accessible components
- **Sonner** for toast notifications
- **Motion** for animations (available but not yet used)

## State Management

- Session storage for pinned cards and SQL Studio artifacts
- Local component state for UI interactions
- Mock data from `/src/app/data/mock-data.ts`

## File Structure

```
/src/app/
├── App.tsx                      # Router provider
├── routes.ts                    # Route configuration
├── data/
│   └── mock-data.ts            # All mock artifacts and events
├── components/
│   ├── layout/
│   │   ├── root-layout.tsx     # Main layout with nav
│   │   ├── top-nav.tsx         # Top navigation bar
│   │   └── left-rail.tsx       # Sidebar navigation
│   ├── verified-badge.tsx      # Verified/unverified badge
│   ├── result-card.tsx         # Agent result card
│   ├── dashboard-card.tsx      # Discovery card
│   ├── action-chips.tsx        # Action buttons
│   ├── query-skeleton.tsx      # Loading state
│   ├── confidence-banner.tsx   # Low confidence warning
│   ├── query-error.tsx         # Error state
│   └── keyboard-shortcuts-modal.tsx
├── pages/
│   ├── home-page.tsx           # Discovery feed
│   ├── agent-page.tsx          # Chat interface
│   ├── dashboard-canvas-page.tsx
│   ├── sql-studio-page.tsx
│   ├── notebooks-page.tsx
│   ├── verification-page.tsx
│   └── telemetry-page.tsx
└── context/
    └── app-context.tsx         # Global state (not fully utilized)
```

## Next Steps / Enhancements

- Add drag-and-drop for dashboard canvas
- Implement chart type switching in right rail
- Add SQL syntax highlighting
- Connect keyboard shortcuts
- Add filters to Discovery feed
- Implement actual search functionality
- Add more notebook templates
- Export dashboard as PDF
- Add user profile settings
- Implement role-based access control

## Notes

This is a frontend prototype with mock data. All interactions are simulated client-side. For production:
- Connect to real backend APIs
- Implement authentication
- Add proper error handling
- Add data persistence
- Implement WebSocket for real-time updates
- Add comprehensive testing
