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

- **React 18** with TypeScript
- **Vite 7** for build tooling
- **React Router 7** (hash routing)
- **styled-components** and **@doordash/prism-react** for UI
- **Monaco Editor** for SQL editing
- **Motion** for animations
- **Recharts** for data visualization

## Getting Started

### Prerequisites

- **[nvm](https://github.com/nvm-sh/nvm)** (recommended) — Node version is pinned in [`.nvmrc`](./.nvmrc) (currently **22**)
- **npm** (bundled with Node)
- **DoorDash npm registry auth** — this app depends on `@doordash/prism-react`, which is hosted on DoorDash Artifactory. See [Private packages (`.npmrc`)](#private-packages-npmrc) below.

### How to run (from a clean clone)

From the repo root:

```bash
# Load nvm if your shell doesn’t auto-load it (zsh/bash)
source ~/.nvm/nvm.sh

# Install and use the Node version from .nvmrc
nvm install
nvm use

# Install dependencies (requires Artifactory auth — see below)
npm install

# Start the dev server → http://localhost:5180
npm run dev
```

If `nvm use` is already part of your workflow (e.g. direnv or shell hook), you only need `nvm use` (or `nvm install && nvm use` the first time).

### Private packages (`.npmrc`)

The committed [`.npmrc`](./.npmrc) does two things:

1. **Scope routing** — `@doordash` and `@dash` packages are resolved from  
   `https://ddartifacts.jfrog.io/ddartifacts/api/npm/npm-local/`
2. **`legacy-peer-deps=true`** — avoids strict peer-resolution failures for some dependencies

It does **not** store credentials. You must authenticate to that registry from your machine, for example:

- Add an auth token for `ddartifacts.jfrog.io` to your **user** `~/.npmrc` (follow internal docs for generating or rotating the token), or
- Use whatever your team documents (`npm login`, SSO, etc.) for Artifactory

Until that is set up, `npm install` will typically fail when fetching `@doordash/prism-react`.

### Development

```bash
npm run dev
```

By default the app is served at **http://localhost:5180** (override with the `VITE_PORT` environment variable).

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

The project uses a custom design system with Prism and styled-components:
- Theme support (light/dark mode with persistent preference)
- Violet/slate color scheme for headers and accents
- DoorDash brand colors (`--dd-primary: #FF3A00`)
- Shared shadows and glass styles via `src/styles/theme.ts` and CSS variables in `src/styles/global-styles.ts`
- Motion animation variants for smooth transitions
- Consistent spacing and typography system

See `src/styles/global-styles.ts` for `--app-*` design tokens and `src/styles/theme.ts` for theme helpers used in components. Prism dark mode tokens are bridged in `src/styles/prism-theming-overrides.ts`.

## Development Notes

- Currently uses mock data (see `src/app/data/`)
- Backend integration not yet implemented
- All routes use hash routing for compatibility
- Keyboard shortcuts available (press `?` in app)

## For AI Assistants

See [CLAUDE.md](./CLAUDE.md) for detailed development guidance and architectural documentation.

## License

Private project - All rights reserved
