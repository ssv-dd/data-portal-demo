# Data Portal - AI-Native Analytics Interface

A modern, AI-native data analytics platform featuring intelligent data exploration, SQL editing, interactive dashboards, and automated workflows.

## Overview

This project is a modern data analytics platform that integrates AI capabilities directly into the user experience. It provides:

- **AI-Powered Discovery** - Natural language interface for data exploration
- **SQL Studio** - Monaco-based SQL editor with AI assistance
- **Executive Scorecard** - Role-based metric dashboards
- **Interactive Dashboards** - Canvas-based visualization builder
- **Notebooks** - Collaborative analysis workspace
- **AI Workflows** - Automated data pipelines

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **React Router 7** (hash routing)
- **Tailwind CSS v4** with custom design system
- **Radix UI** for accessible components
- **Monaco Editor** for SQL editing
- **Motion** (Framer Motion) for animations
- **Recharts** for data visualization

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server (runs on http://localhost:5180)
npm run dev
```

The dev server will automatically open in your browser. By default, it runs on port 5180 (configurable via `VITE_PORT` environment variable).

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── pages/              # Page-level components
│   ├── components/         # Reusable components
│   │   ├── ui/            # Radix UI primitives
│   │   ├── layout/        # Layout components
│   │   └── scorecard/     # Scorecard components
│   ├── data/              # Mock data
│   ├── lib/               # Utilities (motion, etc.)
│   └── routes.tsx         # Route configuration
├── config/
│   └── app.config.ts      # App configuration
├── types/                 # TypeScript types
├── styles/                # Global styles & theme
└── main.tsx              # Entry point
```

## Configuration

### App Configuration

Edit `src/config/app.config.ts` to customize:
- Brand colors
- User settings
- External dashboard URLs
- Feature flags

### Environment Variables

- `VITE_BASE_PATH` - Base path for routing (default: `/Data-Portal-AI-Native/`)
- `VITE_PORT` - Dev server port (default: `5180`)

### Path Aliases

The project uses path aliases for cleaner imports:
```typescript
import { appConfig } from '@/config/app.config'
```

`@/` maps to `./src`

## Features

### Theme Support
- Light and dark mode toggle
- Theme-aware components and glass morphism effects
- Persistent theme preference

### Home Page
- Hero panel with quick prompts and search
- Recent work and discovery feed
- Executive scorecard with role-based metrics
- Quick create actions
- AI chat interface

### SQL Studio
- Full-featured SQL editor with Monaco (theme-aware)
- AI assistant with past chats and knowledge bases
- Query execution with Run/Stop controls
- Low confidence SQL warnings
- Query history organized in folders
- Schema catalog browsing and search
- Multiple database support (Snowflake, Spark, ClickHouse)

### Dashboards
- Canvas-based dashboard builder with metric library
- Dashboard templates and recent canvases
- Interactive visualizations
- Searchable dashboard library in left panel

### Notebooks
- Notebook creation from templates
- Collaborative analysis workspace
- Recent, templates, and shared notebooks views
- Searchable notebook library

### AI Workflows
- Workflow automation and scheduling
- Visual workflow builder with nodes panel
- Workflow status tracking (active, paused, failed)
- Searchable workflow library
- Workflow templates

### Consistent Layout Pattern
- All workspace pages feature a 3-panel layout:
  - Collapsible left panel for navigation and library access
  - Center panel for main content
  - Right panel with context-aware AI assistant

### Design System

The project uses a custom design system built on Tailwind CSS v4:
- Theme support (light/dark mode with persistent preference)
- Violet/slate color scheme for headers and accents
- DoorDash brand colors (`--dd-primary: #FF3A00`)
- Custom shadow utilities (`shadow-card`, `shadow-card-hover`, `shadow-popover`)
- Glassmorphism effects (`glass-panel`, `glass-panel-subtle`, `glass-panel-chat`)
- Motion animation variants for smooth transitions
- Consistent spacing and typography system

See `src/styles/theme.css` for design tokens and `src/styles/index.css` for custom utilities.

## Development Notes

- Currently uses mock data (see `src/app/data/`)
- Backend integration not yet implemented
- All routes use hash routing for compatibility
- Keyboard shortcuts available (press `?` in app)

## For AI Assistants

See [CLAUDE.md](./CLAUDE.md) for detailed development guidance and architectural documentation.

## License

Private project - All rights reserved
