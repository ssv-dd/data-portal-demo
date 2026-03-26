# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (runs on port 5180)
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Available Skills

This project has Claude Code skills configured. Use the Skill tool to invoke them:

**card-styling**
- Defines visual styling conventions for card-like components
- Use when creating new cards, panels, containers, modals, or elevated surfaces
- Ensures consistent rounded corners and visual language

**prism-react**
- API documentation and TypeScript prop types for @doordash/prism-react components
- Use whenever implementing DoorDash UI components
- Provides usage examples and prop definitions

**create-github-pr**
- Automatically creates pull requests based on current branch and commits
- Use after completing feature work and committing changes

Usage: `Skill tool with skill: "card-styling"` or `skill: "prism-react"`

## Tech Stack

- **React 19** + **TypeScript** + **Vite 7**
- **React Router 7** with hash routing (`createHashRouter`)
- **styled-components** for component styling (home page features)
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin (UI primitives, layout)
- **Radix UI** for accessible component primitives
- **Monaco Editor** for SQL editing
- **framer-motion v6.5.1** for animations (import from `'framer-motion'`, NOT `'motion/react'`)
- **Recharts** for data visualization
- **Sonner** for toast notifications
- **Lucide React** for icons

## Project Architecture

### Directory Structure

```
src/
├── app/
│   ├── pages/              # Page-level components
│   │   ├── home-page.tsx
│   │   ├── sql-studio-page.tsx
│   │   ├── notebooks-page.tsx
│   │   ├── dashboard-canvas-page.tsx
│   │   ├── my-canvas-page.tsx
│   │   └── ai-workflows-page.tsx
│   ├── components/
│   │   ├── ui/             # Radix UI primitives (button, card, etc.)
│   │   ├── layout/         # Layout components (root-layout, top-nav)
│   │   ├── home/           # Home page feature components (styled-components)
│   │   │   ├── chat-history-panel.tsx    # Collapsible chat history sidebar
│   │   │   ├── customize-watchlist-panel.tsx  # Metric customization panel
│   │   │   ├── watchlist-table.tsx       # Watchlist with AI insights
│   │   │   ├── your-work-card.tsx        # Jump Back In with tabs
│   │   │   └── discovery-card.tsx        # Discover trending content
│   │   ├── scorecard/      # Scorecard-specific components
│   │   └── analysis-response.tsx  # AI chat with action buttons
│   ├── data/
│   │   ├── mock-data.ts    # Main mock data (golden dashboards, etc.)
│   │   └── mock/           # Feature-specific mock data
│   │       ├── recent-work-data.ts       # yourProjects, recentlyVisited
│   │       ├── scorecard-data.ts         # metrics with aiInsight
│   │       └── chat-conversations-data.ts # chat history
│   ├── lib/
│   │   └── motion.ts       # Animation variants & utilities
│   ├── routes.tsx          # React Router configuration
│   └── App.tsx
├── config/
│   └── app.config.ts       # App configuration (brand color, user, feature flags)
├── types/                  # TypeScript type definitions
├── styles/
│   ├── index.css           # Entry point, custom utilities
│   ├── theme.css           # Design tokens & CSS variables
│   └── theme.ts            # Theme exports (colors, Theme, radius, glassPanel)
└── main.tsx
```

### Routing

Uses React Router 7 with **hash routing** (`createHashRouter`). All routes are nested under `RootLayout`:

- `/` - Home page (discovery, AI chat, executive scorecard)
- `/dashboards` - My canvas page
- `/dashboard/draft` - Dashboard canvas page
- `/sql-studio` - SQL editor with Monaco
- `/notebooks` - Notebooks page
- `/ai-workflows` - AI workflows page

### State Management

Currently uses React's built-in hooks (useState, useEffect, useCallback). No global state management library.

### Path Aliases

Import aliasing configured in `vite.config.ts`:
- `@/` → `./src`

Example: `import { appConfig } from '@/config/app.config'`

### Configuration

**vite.config.ts:**
- Base path: Configurable via `VITE_BASE_PATH` env var (default: `/Data-Portal-AI-Native/`)
- Dev server port: Configurable via `VITE_PORT` env var (default: `5180`)

**src/config/app.config.ts:**
- Brand color mapping
- Mock user data (name, role)
- External dashboard URLs
- Feature flags (smartHighlighting, aiOverview, scorecardCustomization)

## Design System

### Theming

**CSS Variables** are defined in `src/styles/theme.css`:
- DoorDash brand color: `--dd-primary: #FF3A00`
- Semantic tokens: `--foreground`, `--background`, `--muted`, `--accent`, etc.
- Shadow system: `--shadow-card`, `--shadow-card-hover`, `--shadow-popover`

Reference via Tailwind classes: `text-dd-primary`, `bg-muted`, etc.

### Custom Utilities

Defined in `src/styles/index.css`:
- `shadow-card`, `shadow-card-hover`, `shadow-popover`, `shadow-xs`
- `glass-panel`, `glass-panel-subtle`, `glass-panel-chat` - glassmorphism effects
- `glow-primary`, `glow-primary-hover` - brand glow effects

### Motion Animations

Reusable animation variants in `src/app/lib/motion.ts`:
- `fadeInUp`, `staggerContainer`, `staggerItem` - for list animations

## Component Patterns

### UI Components

**Radix UI Primitives** (`src/app/components/ui/`):
- Built on **Radix UI**: Button, Card, Badge, Input, Select, Dialog, Tabs, etc.
- Use `className` with Tailwind utilities
- Leverage `cn()` utility from `ui/utils.ts` for conditional classes

**Home Page Components** (`src/app/components/home/`):
- Built with **styled-components**
- Import theme tokens: `import { colors, radius, glassPanel, Theme } from '@/styles/theme'`
- Use `motion` from `framer-motion` for animations
- Pattern:
  ```typescript
  const StyledComponent = styled.div`
    ${glassPanel}
    border-radius: ${radius.lg};
    color: ${colors.foreground};
    padding: ${Theme.usage.space.small};
  `;
  ```

### Layout

**RootLayout** (`components/layout/root-layout.tsx`):
- Top-level layout with `TopNav` and keyboard shortcuts (press `?`)
- Renders `<Outlet />` for nested routes

**TopNav** (`components/layout/top-nav.tsx`):
- Global navigation bar

### Pages

Pages are full-screen components that:
- Live in `src/app/pages/`
- Use motion animations from `@/app/lib/motion`
- Import UI components from `@/app/components/ui`
- Use mock data from `@/app/data/mock-data` or `@/app/data/mock/`

### Home Page Features

Home page (`src/app/pages/home-page.tsx`) includes several interactive components:

**ChatHistoryPanel** (`components/home/chat-history-panel.tsx`):
- Collapsible sidebar for chat conversation history
- Search functionality with icon (16px, left: 20px)
- Inline variant for embedding in other layouts
- Props: `open`, `onClose`, `onOpen`, `onNewChat`, `onConversationClick`, `inline`

**CustomizeWatchlistPanel** (`components/home/customize-watchlist-panel.tsx`):
- Right-side panel for metric management
- Optimal count logic (3-6 metrics recommended)
- Search and collapsible area sections
- Props: `open`, `onClose`, `productAreas`, `selectedMetricIds`, `onMetricSelectionChange`

**WatchlistTable** (`components/home/watchlist-table.tsx`):
- Displays metrics with AI insights from `aiInsight.summary`
- Two variants: 'A' (AreaTableSlim) and 'B' (AreaStrips)
- Columns: Metric, Current Week, Prior Week, vs Prior Week, Trend, AI Insight
- AI Insight column: 38% width, displays `metric.aiInsight?.summary` with 2-line truncation
- Props: `areas`, `selectedAreaIds`, `selectedMetricIds`, `maxRows`, `variant`, `onCustomize`, `onMetricClick`

**YourWorkCard** (`components/home/your-work-card.tsx`):
- Jump Back In section with tabs: "Your projects" / "Recently visited"
- Three variants: 'A' (tabs), 'B' (side quick actions), 'C' (bottom quick actions)
- Props: `projects`, `recentlyVisited`, `quickActions`, `onItemClick`, `onActionClick`, `variant`
- Legacy support: `recentItems` prop for backward compatibility

**DiscoveryCard** (`components/home/discovery-card.tsx`):
- Renamed from "Trending in your org" to "Discover"
- Shows trending content and recommendations

## Monaco Editor Integration

**SQL Studio** page uses `@monaco-editor/react`:
- Configured with SQL syntax highlighting
- Custom keybindings for query execution
- Integrates with AI assistant sidebar

## Mock Data

Mock data lives in:
- `src/app/data/mock-data.ts` - Main mock data (golden dashboards, etc.)
- `src/app/data/mock/` - Feature-specific mock data

**Key mock data files:**

**recent-work-data.ts:**
- `yourProjects` - Array of user's project items (10 items)
- `recentlyVisited` - Array of recently visited items (10 items)
- `recentWork` - Alias for `yourProjects` (backward compatibility)
- Structure: `{ id, title, meta, status, icon, route }`

**scorecard-data.ts:**
- `productAreas` - Product areas with metrics
- Each metric includes:
  ```typescript
  {
    id, name, current, prior, change, changeLabel,
    trend: number[],  // Sparkline data
    aiInsight: {
      summary: string,      // Display in watchlist table
      confidence: number,   // 0-100
      details: string      // Extended explanation
    }
  }
  ```

**chat-conversations-data.ts:**
- `mockConversations` - Chat history data
- Structure: `{ id, title, timestamp, preview, tags }`

All data is currently static. Backend integration is not yet implemented.

## Styling Guidelines

### styled-components (Home Page Features)

Home page components use **styled-components** for styling:

```typescript
import styled from 'styled-components';
import { colors, radius, glassPanel, Theme } from '@/styles/theme';

const Card = styled.div`
  ${glassPanel}
  border-radius: ${radius['2xl']};
  padding: ${Theme.usage.space.small};
  color: ${colors.foreground};
  background: rgb(var(--app-surface-rgb) / 0.4);
`;
```

**Theme imports from `@/styles/theme`:**
- `colors` - Color tokens (`colors.foreground`, `colors.mutedForeground`, `colors.violet600`, etc.)
- `Theme` - Spacing, font sizes (`Theme.usage.space.small`, `Theme.usage.fontSize.medium`)
- `radius` - Border radius values (`radius.md`, `radius.lg`, `radius['2xl']`)
- `glassPanel` - Glassmorphism mixin for card effects

**CSS variable pattern:**
- Use `rgb(var(--app-*-rgb) / opacity)` for transparent colors
- Examples: `rgb(var(--app-muted-rgb) / 0.4)`, `rgb(var(--app-overlay-rgb) / 0.06)`

### Tailwind CSS (UI Primitives)

UI components in `src/app/components/ui/` use **Tailwind utility classes**:
- Reference CSS variables from `theme.css` for colors (`text-dd-primary`, `bg-muted`, etc.)
- Use custom utilities (`shadow-card`, `glass-panel`) for common patterns
- Leverage `cn()` utility from `ui/utils.ts` for conditional classes

### Animations

- Motion animations use **framer-motion v6.5.1**
- ALWAYS import from `'framer-motion'`, NEVER from `'motion/react'`
- Reusable variants in `src/app/lib/motion.ts` (`fadeInUp`, `staggerContainer`, `staggerItem`)
- Do not upgrade framer-motion without checking Prism peer dependency compatibility

## TypeScript

- Strict mode enabled
- Type definitions in `src/types/`
- Import types: `import type { UserRole } from '@/types'`

## Common Patterns & Best Practices

### Framer Motion Imports

**CRITICAL:** Always import from `'framer-motion'`, never from `'motion/react'`:

```typescript
// ✅ CORRECT
import { motion, AnimatePresence } from 'framer-motion';

// ❌ WRONG - will cause build errors
import { motion, AnimatePresence } from 'motion/react';
```

The project uses framer-motion v6.5.1 to match @doordash/prism-react peer dependencies.

### Theme Variable Access

**styled-components pattern:**
```typescript
import { colors, radius, glassPanel, Theme } from '@/styles/theme';

const Component = styled.div`
  color: ${colors.foreground};           // Static colors
  padding: ${Theme.usage.space.small};   // Spacing tokens
  border-radius: ${radius.lg};           // Border radius
  background: rgb(var(--app-surface-rgb) / 0.4);  // Transparent colors
`;
```

### State Management in Home Page

Home page uses local state with useState:
```typescript
const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
const [customizeWatchlistOpen, setCustomizeWatchlistOpen] = useState(false);
const [selectedMetricIds, setSelectedMetricIds] = useState<string[]>(initialMetricIds);
```

Pass handlers down as props to child components.

### Icon Usage

Import icons from **lucide-react**:
```typescript
import { ChevronRight, Search, Eye, Sparkles } from 'lucide-react';

// Use with inline styles
<Icon style={{ width: 16, height: 16, color: colors.violet600 }} />
```

### Motion Animations

Use motion components from framer-motion:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  {children}
</motion.div>
```

For exit animations, wrap with `<AnimatePresence>`.
