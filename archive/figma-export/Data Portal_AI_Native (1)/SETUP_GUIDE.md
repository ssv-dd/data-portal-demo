# DoorDash AI-Native BI Frontend Prototype - Setup Guide

This guide will help you recreate this entire project in Cursor.

## Quick Start

### 1. Create a new project directory
```bash
mkdir doordash-bi-prototype
cd doordash-bi-prototype
```

### 2. Initialize the project
```bash
npm init -y
```

### 3. Install all dependencies
```bash
npm install @emotion/react@11.14.0 @emotion/styled@11.14.1 @monaco-editor/react@^4.7.0 @mui/icons-material@7.3.5 @mui/material@7.3.5 @popperjs/core@2.11.8 @radix-ui/react-accordion@1.2.3 @radix-ui/react-alert-dialog@1.1.6 @radix-ui/react-aspect-ratio@1.1.2 @radix-ui/react-avatar@1.1.3 @radix-ui/react-checkbox@1.1.4 @radix-ui/react-collapsible@1.1.3 @radix-ui/react-context-menu@2.2.6 @radix-ui/react-dialog@1.1.6 @radix-ui/react-dropdown-menu@2.1.6 @radix-ui/react-hover-card@1.1.6 @radix-ui/react-label@2.1.2 @radix-ui/react-menubar@1.1.6 @radix-ui/react-navigation-menu@1.2.5 @radix-ui/react-popover@1.1.6 @radix-ui/react-progress@1.1.2 @radix-ui/react-radio-group@1.2.3 @radix-ui/react-scroll-area@1.2.3 @radix-ui/react-select@2.1.6 @radix-ui/react-separator@1.1.2 @radix-ui/react-slider@1.2.3 @radix-ui/react-slot@1.1.2 @radix-ui/react-switch@1.1.3 @radix-ui/react-tabs@1.1.3 @radix-ui/react-toggle@1.1.2 @radix-ui/react-toggle-group@1.1.2 @radix-ui/react-tooltip@1.1.8 class-variance-authority@0.7.1 clsx@2.1.1 cmdk@1.1.1 date-fns@3.6.0 embla-carousel-react@8.6.0 input-otp@1.4.2 lucide-react@0.487.0 motion@12.23.24 next-themes@0.4.6 react-day-picker@8.10.1 react-dnd@16.0.1 react-dnd-html5-backend@16.0.1 react-hook-form@7.55.0 react-popper@2.3.0 react-resizable-panels@2.1.7 react-responsive-masonry@2.7.1 react-router@7.13.0 react-slick@0.31.0 recharts@2.15.2 sonner@2.0.3 tailwind-merge@3.2.0 tw-animate-css@1.3.8 vaul@1.1.2

npm install -D @tailwindcss/vite@4.1.12 @vitejs/plugin-react@4.7.0 tailwindcss@4.1.12 vite@6.3.5

npm install react@18.3.1 react-dom@18.3.1
```

### 4. Project Structure

Create the following directory structure:

```
doordash-bi-prototype/
├── package.json
├── vite.config.ts
├── postcss.config.mjs
├── index.html
├── src/
│   ├── main.tsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── fonts.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.ts
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── root-layout.tsx
│   │   │   │   ├── top-nav.tsx
│   │   │   │   └── left-rail.tsx
│   │   │   ├── ui/ (shadcn components)
│   │   │   ├── ai-assistant-sidebar.tsx
│   │   │   ├── ai-agent-sidebar.tsx
│   │   │   ├── dashboard-card.tsx
│   │   │   ├── result-card.tsx
│   │   │   ├── verified-badge.tsx
│   │   │   ├── confidence-banner.tsx
│   │   │   ├── action-chips.tsx
│   │   │   ├── query-skeleton.tsx
│   │   │   ├── query-error.tsx
│   │   │   └── keyboard-shortcuts-modal.tsx
│   │   ├── context/
│   │   │   └── app-context.tsx
│   │   ├── data/
│   │   │   └── mock-data.ts
│   │   └── pages/
│   │       ├── home-page.tsx
│   │       ├── my-canvas-page.tsx
│   │       ├── agent-page.tsx
│   │       ├── dashboard-canvas-page.tsx
│   │       ├── sql-studio-page.tsx
│   │       ├── notebooks-page.tsx
│   │       ├── metric-registry-page.tsx
│   │       ├── ai-workflows-page.tsx
│   │       ├── verification-page.tsx
│   │       └── telemetry-page.tsx
```

## Configuration Files Content

See the following files for complete configuration:
- CODE_EXPORT_1.md - Configuration files (package.json, vite.config.ts, etc.)
- CODE_EXPORT_2.md - Styles (CSS files)
- CODE_EXPORT_3.md - Layout components
- CODE_EXPORT_4.md - Page components (Part 1)
- CODE_EXPORT_5.md - Page components (Part 2)
- CODE_EXPORT_6.md - Shared components
- CODE_EXPORT_7.md - UI components (shadcn)

## Entry Point

Create `index.html` in the root:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DoorDash BI Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## Running the Project

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Key Features

- 🎨 DoorDash branding with #FF3A00 primary color
- 📱 Desktop-focused layout (1440×1024)
- 🤖 AI Assistant sidebar on SQL Studio, Dashboards, and Notebooks
- 🧭 React Router for navigation
- 💅 Tailwind CSS v4 for styling
- 📊 Recharts for data visualization
- ✨ Motion (Framer Motion) for animations
- 🎹 Monaco Editor for SQL editing

## Next Steps

1. Review all CODE_EXPORT_*.md files
2. Copy the code from each file into your project
3. Run `npm run dev` to start the development server
4. Customize as needed for your use case
