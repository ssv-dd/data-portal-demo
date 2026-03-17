# 🚀 DoorDash AI-Native BI Frontend Prototype - Complete Export Guide

Welcome! This guide will help you transfer this entire DoorDash BI prototype from Figma Make to Cursor.

---

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [Export Documentation](#export-documentation)
3. [Project Overview](#project-overview)
4. [File Structure](#file-structure)
5. [Key Features](#key-features)

---

## ⚡ Quick Start

### Method 1: Use Figma Make Export (Fastest)

1. **Look for Export button** in Figma Make (usually top-right corner)
2. **Download ZIP file** of your project
3. **Extract and open in Cursor**:
   ```bash
   cd your-extracted-folder
   npm install
   npm run dev
   ```

### Method 2: Manual Setup

See **[DOWNLOAD_INSTRUCTIONS.md](./DOWNLOAD_INSTRUCTIONS.md)** for detailed steps.

---

## 📚 Export Documentation

I've created several documentation files to help you:

### 1. **DOWNLOAD_INSTRUCTIONS.md** ⭐ START HERE
- Step-by-step guide for exporting from Figma Make
- Manual recreation instructions if export is unavailable
- Troubleshooting common issues
- Image asset replacement guide

### 2. **COMPLETE_CODE_EXPORT.md**
- Complete overview of project structure
- Quick reference for all files
- Notes on DoorDash branding
- Tips for Cursor development

### 3. **CODE_EXPORT_CONFIG.md**
- All configuration files (package.json, vite.config.ts, etc.)
- Complete and ready to copy-paste
- Includes TypeScript configs

### 4. **SETUP_GUIDE.md**
- Detailed setup walkthrough
- Directory structure
- Key features overview
- Next steps for development

---

## 🎯 Project Overview

### What This Prototype Does

This is a **complete DoorDash BI platform prototype** featuring:

✅ **8 Main Application Pages**:
- Home (AI chat with discovery)
- My Canvas (Dashboards)
- SQL Studio (with Monaco Editor)
- Notebooks
- AI Workflows
- Asset Verification
- Metric Registry
- Admin Telemetry

✅ **AI-First Experience**:
- Persistent AI Assistant sidebar on key pages
- Context-aware suggestions
- Chat-based data exploration
- Hybrid mode (Chat + Notebook)

✅ **Polished UI/UX**:
- DoorDash branding (#FF3A00 primary color)
- Smooth Motion animations
- Responsive desktop layout (1440×1024)
- Keyboard shortcuts support (press `?`)

---

## 📁 File Structure

```
doordash-bi-prototype/
├── 📄 Configuration Files
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   └── index.html
│
├── 📂 src/
│   ├── main.tsx                 # Entry point
│   ├── 📂 styles/
│   │   ├── index.css           # Main CSS
│   │   ├── fonts.css           # Font imports
│   │   ├── tailwind.css        # Tailwind config
│   │   └── theme.css           # DoorDash design tokens
│   │
│   └── 📂 app/
│       ├── App.tsx             # Root component
│       ├── routes.ts           # React Router config
│       │
│       ├── 📂 components/
│       │   ├── 📂 layout/
│       │   │   ├── root-layout.tsx
│       │   │   └── top-nav.tsx
│       │   ├── 📂 ui/          # shadcn components
│       │   ├── ai-assistant-sidebar.tsx
│       │   ├── ai-agent-sidebar.tsx
│       │   ├── dashboard-card.tsx
│       │   ├── verified-badge.tsx
│       │   ├── confidence-banner.tsx
│       │   └── [... more components]
│       │
│       ├── 📂 context/
│       │   └── app-context.tsx
│       │
│       ├── 📂 data/
│       │   └── mock-data.ts    # Mock data & types
│       │
│       └── 📂 pages/
│           ├── home-page.tsx
│           ├── my-canvas-page.tsx
│           ├── sql-studio-page.tsx
│           ├── notebooks-page.tsx
│           ├── ai-workflows-page.tsx
│           ├── verification-page.tsx
│           ├── telemetry-page.tsx
│           ├── metric-registry-page.tsx
│           ├── agent-page.tsx
│           └── dashboard-canvas-page.tsx
```

---

## ✨ Key Features

### 🎨 Design System
- **Primary Color**: #FF3A00 (DoorDash red)
- **Typography**: System fonts with custom scaling
- **Components**: shadcn/ui based design system
- **Icons**: Lucide React
- **Animations**: Motion (formerly Framer Motion)

### 🤖 AI Features
- **Context-Aware Assistants**: Different prompts for SQL, Notebooks, and Dashboards
- **Chat Modes**: Chat, Hybrid, and Notebook modes
- **Purpose Selection**: Analysis, Exploration, or Reporting
- **Smart Suggestions**: Pre-populated suggestion chips

### 🛠️ Tech Stack
- **Framework**: React 18.3.1
- **Routing**: React Router 7.13.0
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Code Editor**: Monaco Editor
- **Animations**: Motion
- **Build Tool**: Vite 6.3.5

### ⌨️ Interactions
- **Keyboard Shortcuts**: Press `?` to see all shortcuts
- **Search**: Instant search across artifacts
- **Filters**: Multi-filter support (All, My Work, Shared, etc.)
- **Verification**: Asset verification workflow

---

## 🔑 Key Files to Understand

### Core Application
1. **src/app/App.tsx** - Root component with router
2. **src/app/routes.ts** - All application routes
3. **src/app/data/mock-data.ts** - Mock data and TypeScript types

### Critical Pages
1. **home-page.tsx** - AI chat interface with smooth transitions
2. **sql-studio-page.tsx** - SQL editor with Monaco
3. **my-canvas-page.tsx** - Dashboard listing
4. **notebooks-page.tsx** - Notebooks listing

### Shared Components
1. **ai-assistant-sidebar.tsx** - Reusable AI assistant
2. **top-nav.tsx** - Main navigation with tabs
3. **dashboard-card.tsx** - Artifact card component

---

## 🎯 Next Steps After Export

### Immediate Tasks
1. ✅ Install dependencies (`npm install`)
2. ✅ Replace `figma:asset` imports with real images
3. ✅ Run development server (`npm run dev`)
4. ✅ Test all pages and interactions

### Enhancements
1. 🔌 **Connect Real Backend**
   - Replace mock data with API calls
   - Add authentication
   - Implement real SQL execution

2. 📊 **Enhance Features**
   - Make Monaco Editor fully functional
   - Add real chart data
   - Implement notebook execution

3. 🧪 **Add Testing**
   - Unit tests with Jest
   - Component tests with React Testing Library
   - E2E tests with Playwright

4. 🚀 **Deploy**
   - Build for production (`npm run build`)
   - Deploy to Vercel/Netlify
   - Set up CI/CD

---

## 📦 Dependencies Overview

### Core
- React 18.3.1
- React Router 7.13.0
- Vite 6.3.5

### UI & Styling
- Tailwind CSS 4.1.12
- Radix UI (component primitives)
- Lucide React (icons)
- Motion (animations)

### Features
- Monaco Editor (SQL editing)
- Recharts (charts)
- React DnD (drag & drop)
- Sonner (toasts)

### Forms & Data
- React Hook Form 7.55.0
- Date-fns (date utilities)

---

## 🆘 Getting Help

### Common Issues

**Q: Can't find the Export button in Figma Make**
A: Check the top-right corner of the interface. If not available, use Manual Setup method.

**Q: Getting "figma:asset" import errors**
A: These are Figma-specific. Replace with regular image URLs. See DOWNLOAD_INSTRUCTIONS.md.

**Q: Tailwind classes not working**
A: Ensure `@tailwindcss/vite` plugin is in vite.config.ts and styles are imported correctly.

**Q: Monaco Editor not loading**
A: Check that `@monaco-editor/react` is installed and imported correctly.

### Resources
- [Cursor Docs](https://cursor.sh/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## ✅ Final Checklist

Before you start developing in Cursor:

- [ ] Project exported from Figma Make OR manually recreated
- [ ] All dependencies installed
- [ ] Development server running (`npm run dev`)
- [ ] All pages load without errors
- [ ] Images are displaying (or replaced with placeholders)
- [ ] TypeScript types are recognized
- [ ] AI Assistant sidebar is working
- [ ] Navigation between pages works
- [ ] Keyboard shortcuts work (press `?`)

---

## 🎉 You're Ready!

You now have a complete DoorDash BI prototype ready for Cursor development.

### Quick Reference
1. **Start here**: DOWNLOAD_INSTRUCTIONS.md
2. **Copy code**: CODE_EXPORT_CONFIG.md & COMPLETE_CODE_EXPORT.md
3. **Setup help**: SETUP_GUIDE.md
4. **This file**: Overview and reference

Happy coding! 🚀

---

## 📄 License & Attribution

This is a prototype built with Figma Make. Feel free to use and modify for your needs.

**Built with:**
- Figma Make
- React
- Tailwind CSS v4
- TypeScript
- Vite

**DoorDash Branding:**
- Primary color #FF3A00 is used as reference
- This is a prototype, not affiliated with DoorDash Inc.
