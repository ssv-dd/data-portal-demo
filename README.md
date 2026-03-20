# Data Portal - AI-Native Analytics Interface

An AI-native data portal UI built from Figma designs, featuring intelligent data exploration, SQL editing, and interactive dashboards.

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

### Home Page
- AI chat interface with multiple modes (chat, hybrid, notebook)
- Executive scorecard with role-based metrics
- Personalized recommendations
- Quick access to recent and favorite assets

### SQL Studio
- Full-featured SQL editor with Monaco
- AI assistant for query help
- Query history and folders
- Schema browsing and search
- Multiple knowledge bases

### Dashboards
- Canvas-based dashboard builder
- Golden dashboards by role
- Interactive visualizations
- Real-time collaboration

### Design System

The project uses a custom design system built on Tailwind CSS v4:
- DoorDash brand colors (`--dd-primary: #FF3A00`)
- Custom shadow utilities (`shadow-card`, `shadow-card-hover`)
- Glassmorphism effects (`glass-panel`, `glass-panel-chat`)
- Motion animation variants

See `src/styles/theme.css` for design tokens.

## Development Notes

- Currently uses mock data (see `src/app/data/`)
- Backend integration not yet implemented
- All routes use hash routing for compatibility
- Keyboard shortcuts available (press `?` in app)

## For AI Assistants

See [CLAUDE.md](./CLAUDE.md) for detailed development guidance and architectural documentation.

## License

Private project - All rights reserved
