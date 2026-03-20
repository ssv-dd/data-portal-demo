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

## Tech Stack

- **React 19** + **TypeScript** + **Vite 7**
- **React Router 7** with hash routing (`createHashRouter`)
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- **Radix UI** for accessible component primitives
- **Monaco Editor** for SQL editing
- **Motion** (Framer Motion) for animations
- **Recharts** for data visualization
- **Sonner** for toast notifications

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
│   │   └── scorecard/      # Scorecard-specific components
│   ├── data/
│   │   ├── mock-data.ts    # Mock data
│   │   └── mock/           # Mock data by feature
│   ├── lib/
│   │   └── motion.ts       # Animation variants & utilities
│   ├── routes.tsx          # React Router configuration
│   └── App.tsx
├── config/
│   └── app.config.ts       # App configuration (brand color, user, feature flags)
├── types/                  # TypeScript type definitions
├── styles/
│   ├── index.css           # Entry point, custom utilities
│   └── theme.css           # Design tokens & CSS variables
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

All UI primitives are in `src/app/components/ui/` and built on **Radix UI**:
- Button, Card, Badge, Input, Select, Dialog, Tabs, etc.
- Use `className` with Tailwind utilities
- Leverage `cn()` utility from `ui/utils.ts` for conditional classes

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

## Monaco Editor Integration

**SQL Studio** page uses `@monaco-editor/react`:
- Configured with SQL syntax highlighting
- Custom keybindings for query execution
- Integrates with AI assistant sidebar

## Mock Data

Mock data lives in:
- `src/app/data/mock-data.ts` - Main mock data (golden dashboards, etc.)
- `src/app/data/mock/` - Feature-specific mock data

All data is currently static. Backend integration is not yet implemented.

## Styling Guidelines

- Use **Tailwind utility classes** for styling
- Reference CSS variables from `theme.css` for colors (`text-dd-primary`, `bg-muted`, etc.)
- Use custom utilities (`shadow-card`, `glass-panel`) for common patterns
- Prefer inline Tailwind over custom CSS unless creating reusable utilities
- Motion animations use `motion` from `motion/react` (not `framer-motion`)

## TypeScript

- Strict mode enabled
- Type definitions in `src/types/`
- Import types: `import type { UserRole } from '@/types'`
