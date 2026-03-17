# 📋 Complete File Manifest

This document lists **every single file** in this DoorDash BI prototype that you'll need to copy to Cursor.

---

## 🎯 How to Use This Manifest

For each file listed below:
1. Open it in Figma Make (if viewing the current project)
2. Copy its contents
3. Create the same file in your Cursor project
4. Paste the contents

**OR** use Figma Make's Export feature to download everything at once.

---

## 📁 Configuration Files (Root Level)

```
/ (root)
├── package.json                    ⭐ CRITICAL - Contains all dependencies
├── vite.config.ts                  ⭐ CRITICAL - Vite configuration
├── postcss.config.mjs              ⭐ CRITICAL - PostCSS config
├── tsconfig.json                   ⭐ CRITICAL - TypeScript config
├── tsconfig.node.json              - TypeScript config for Node
└── index.html                      ⭐ CRITICAL - HTML entry point
```

**See CODE_EXPORT_CONFIG.md for complete contents of these files.**

---

## 🎨 Styles (src/styles/)

```
src/styles/
├── index.css                       ⭐ CRITICAL - Main CSS import file
├── fonts.css                       - Font imports (currently empty)
├── tailwind.css                    ⭐ CRITICAL - Tailwind v4 config
└── theme.css                       ⭐ CRITICAL - DoorDash design tokens
```

**Access in Figma Make:**
- `/src/styles/index.css`
- `/src/styles/fonts.css`
- `/src/styles/tailwind.css`
- `/src/styles/theme.css`

---

## ⚙️ App Core (src/app/)

```
src/app/
├── App.tsx                         ⭐ CRITICAL - Main app component
└── routes.ts                       ⭐ CRITICAL - React Router configuration
```

**Access in Figma Make:**
- `/src/app/App.tsx`
- `/src/app/routes.ts`

---

## 📊 Data & Context (src/app/)

```
src/app/
├── data/
│   └── mock-data.ts               ⭐ CRITICAL - All mock data and TypeScript types
└── context/
    └── app-context.tsx            - React context (if using shared state)
```

**Access in Figma Make:**
- `/src/app/data/mock-data.ts`
- `/src/app/context/app-context.tsx`

---

## 🏗️ Layout Components (src/app/components/layout/)

```
src/app/components/layout/
├── root-layout.tsx                ⭐ CRITICAL - Root layout with TopNav
├── top-nav.tsx                    ⭐ CRITICAL - Main navigation bar
└── left-rail.tsx                  - Left sidebar (if exists)
```

**Access in Figma Make:**
- `/src/app/components/layout/root-layout.tsx`
- `/src/app/components/layout/top-nav.tsx`
- `/src/app/components/layout/left-rail.tsx`

---

## 🧩 Feature Components (src/app/components/)

```
src/app/components/
├── ai-assistant-sidebar.tsx       ⭐ CRITICAL - AI assistant for SQL/Notebooks/Dashboards
├── ai-agent-sidebar.tsx           ⭐ CRITICAL - Main agent chat interface
├── dashboard-card.tsx             ⭐ IMPORTANT - Card component for artifacts
├── result-card.tsx                - Search result card
├── verified-badge.tsx             - Verification status badge
├── confidence-banner.tsx          - Confidence level banner
├── action-chips.tsx               - Action chip buttons
├── query-skeleton.tsx             - Loading skeleton
├── query-error.tsx                - Error display component
└── keyboard-shortcuts-modal.tsx   - Keyboard shortcuts help modal
```

**Access in Figma Make:**
- `/src/app/components/ai-assistant-sidebar.tsx`
- `/src/app/components/ai-agent-sidebar.tsx`
- `/src/app/components/dashboard-card.tsx`
- `/src/app/components/result-card.tsx`
- `/src/app/components/verified-badge.tsx`
- `/src/app/components/confidence-banner.tsx`
- `/src/app/components/action-chips.tsx`
- `/src/app/components/query-skeleton.tsx`
- `/src/app/components/query-error.tsx`
- `/src/app/components/keyboard-shortcuts-modal.tsx`

---

## 📄 Page Components (src/app/pages/)

```
src/app/pages/
├── home-page.tsx                  ⭐ CRITICAL - Home with AI chat and discovery
├── my-canvas-page.tsx             ⭐ CRITICAL - Dashboards listing page
├── sql-studio-page.tsx            ⭐ CRITICAL - SQL editor with Monaco
├── notebooks-page.tsx             ⭐ CRITICAL - Notebooks listing page
├── agent-page.tsx                 ⭐ IMPORTANT - Dedicated agent chat page
├── ai-workflows-page.tsx          ⭐ IMPORTANT - AI workflows management
├── dashboard-canvas-page.tsx      - Dashboard editor/canvas
├── verification-page.tsx          - Asset verification interface
├── telemetry-page.tsx             - Admin telemetry dashboard
└── metric-registry-page.tsx       - Metrics catalog page
```

**Access in Figma Make:**
- `/src/app/pages/home-page.tsx` ⭐ **LARGEST FILE - Contains complex animation logic**
- `/src/app/pages/my-canvas-page.tsx`
- `/src/app/pages/sql-studio-page.tsx`
- `/src/app/pages/notebooks-page.tsx`
- `/src/app/pages/agent-page.tsx`
- `/src/app/pages/ai-workflows-page.tsx`
- `/src/app/pages/dashboard-canvas-page.tsx`
- `/src/app/pages/verification-page.tsx`
- `/src/app/pages/telemetry-page.tsx`
- `/src/app/pages/metric-registry-page.tsx`

---

## 🎨 UI Components (src/app/components/ui/)

These are shadcn/ui components. You have **two options**:

### Option A: Copy from Figma Make (Faster)
Copy all files from `/src/app/components/ui/` directory:

```
src/app/components/ui/
├── accordion.tsx
├── alert-dialog.tsx
├── alert.tsx
├── aspect-ratio.tsx
├── avatar.tsx
├── badge.tsx
├── breadcrumb.tsx
├── button.tsx                     ⭐ CRITICAL - Used everywhere
├── calendar.tsx
├── card.tsx                       ⭐ CRITICAL - Used for artifact cards
├── carousel.tsx
├── chart.tsx
├── checkbox.tsx
├── collapsible.tsx
├── command.tsx
├── context-menu.tsx
├── dialog.tsx
├── drawer.tsx
├── dropdown-menu.tsx              ⭐ CRITICAL - Used in top nav
├── form.tsx
├── hover-card.tsx
├── input-otp.tsx
├── input.tsx                      ⭐ CRITICAL - Used for search/input
├── label.tsx
├── menubar.tsx
├── navigation-menu.tsx
├── pagination.tsx
├── popover.tsx
├── progress.tsx
├── radio-group.tsx
├── resizable.tsx
├── scroll-area.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── sidebar.tsx
├── skeleton.tsx
├── slider.tsx
├── sonner.tsx                     ⭐ CRITICAL - Toast notifications
├── switch.tsx
├── table.tsx
├── tabs.tsx                       ⭐ CRITICAL - Used for page filters
├── textarea.tsx
├── toggle-group.tsx
├── toggle.tsx
├── tooltip.tsx
├── use-mobile.ts                  - Mobile detection hook
└── utils.ts                       ⭐ CRITICAL - Utility functions (cn, etc.)
```

**Access in Figma Make:** Browse `/src/app/components/ui/` folder

### Option B: Use shadcn CLI in Cursor (Recommended)
```bash
# Initialize shadcn
npx shadcn@latest init

# Add individual components as needed
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
# ... etc
```

---

## 🚫 Protected/System Files (DO NOT MODIFY)

```
src/app/components/figma/
└── ImageWithFallback.tsx          🔒 PROTECTED - Figma Make system file
```

**Note:** This is a Figma Make system file. Don't copy it - it won't work outside Figma Make.

---

## 📸 Image Assets

The project uses `figma:asset` imports for images. These are **virtual imports** that only work in Figma Make.

**In home-page.tsx, you'll find:**
```tsx
import analysisImage1 from 'figma:asset/d6b9d1d8fdb529e192abe6751b36c052d614bcb5.png';
import analysisImage2 from 'figma:asset/5c0e7f34cca6266d880bc65e3886864db9c9f58e.png';
import analysisImage3 from 'figma:asset/e92bb809d34376a76ee39d05ce59b8d6ab4ebe9e.png';
import analysisImage4 from 'figma:asset/4f324fe81a43d267428a412a9cb2106d72a998b7.png';
import chartImage from 'figma:asset/29959f5a2af5a7bfbcff0b5b00934dbaaa3ef381.png';
```

**⚠️ IMPORTANT:** You must replace these in Cursor with:
- Placeholder URLs: `'https://via.placeholder.com/800x400'`
- Local images: `'/images/analysis1.png'` (place in `/public/images/`)
- Hosted images: Your own image hosting URLs

---

## 📝 Entry Point File

```
src/
└── main.tsx                       ⭐ CRITICAL - App entry point
```

**Access in Figma Make:** `/src/main.tsx`

**Contents:**
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

---

## 📊 Priority Levels

### ⭐ CRITICAL (Must Have - App Won't Run Without These)
- All configuration files (package.json, vite.config.ts, tsconfig.json)
- index.html
- src/main.tsx
- src/app/App.tsx
- src/app/routes.ts
- All CSS files (theme.css, tailwind.css, index.css)
- Layout components (root-layout.tsx, top-nav.tsx)
- Mock data (mock-data.ts)
- All page components
- AI assistant components
- Core UI components (button, input, card, tabs, dropdown-menu, sonner, utils.ts)

### ⭐ IMPORTANT (Highly Recommended)
- Feature components (dashboard-card, verified-badge, etc.)
- Agent page
- AI workflows page
- Most UI components

### ✨ OPTIONAL (Nice to Have)
- Telemetry page
- Verification page
- Metric registry page
- Less frequently used UI components

---

## 🎯 Quick Copy Checklist

Use this checklist when copying files to Cursor:

### Configuration (5 files)
- [ ] package.json
- [ ] vite.config.ts
- [ ] postcss.config.mjs
- [ ] tsconfig.json
- [ ] index.html

### Styles (4 files)
- [ ] src/styles/index.css
- [ ] src/styles/fonts.css
- [ ] src/styles/tailwind.css
- [ ] src/styles/theme.css

### App Core (3 files)
- [ ] src/main.tsx
- [ ] src/app/App.tsx
- [ ] src/app/routes.ts

### Data (1 file)
- [ ] src/app/data/mock-data.ts

### Layout (2 files)
- [ ] src/app/components/layout/root-layout.tsx
- [ ] src/app/components/layout/top-nav.tsx

### Feature Components (10 files)
- [ ] src/app/components/ai-assistant-sidebar.tsx
- [ ] src/app/components/ai-agent-sidebar.tsx
- [ ] src/app/components/dashboard-card.tsx
- [ ] src/app/components/result-card.tsx
- [ ] src/app/components/verified-badge.tsx
- [ ] src/app/components/confidence-banner.tsx
- [ ] src/app/components/action-chips.tsx
- [ ] src/app/components/query-skeleton.tsx
- [ ] src/app/components/query-error.tsx
- [ ] src/app/components/keyboard-shortcuts-modal.tsx

### Pages (10 files)
- [ ] src/app/pages/home-page.tsx
- [ ] src/app/pages/my-canvas-page.tsx
- [ ] src/app/pages/sql-studio-page.tsx
- [ ] src/app/pages/notebooks-page.tsx
- [ ] src/app/pages/agent-page.tsx
- [ ] src/app/pages/ai-workflows-page.tsx
- [ ] src/app/pages/dashboard-canvas-page.tsx
- [ ] src/app/pages/verification-page.tsx
- [ ] src/app/pages/telemetry-page.tsx
- [ ] src/app/pages/metric-registry-page.tsx

### UI Components (~30 files)
- [ ] Use shadcn CLI in Cursor OR
- [ ] Copy all files from src/app/components/ui/

---

## 🔍 Finding Files in Figma Make

1. **File Explorer**: Look for a file tree/explorer in the left sidebar
2. **Search**: Use Cmd/Ctrl+P to open file search
3. **Direct Path**: Type the path (e.g., `/src/app/App.tsx`) in the file navigator

---

## ✅ Verification

After copying all files to Cursor:

```bash
# Check file count
find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.css" | wc -l
# Should be around 50-60 files

# Try to run
npm install
npm run dev
```

If you see errors, check:
1. All CRITICAL files are present
2. package.json has all dependencies
3. figma:asset imports are replaced
4. UI components exist or shadcn is initialized

---

## 🆘 Missing Files?

If you can't find a file in Figma Make:

1. **Check the current project structure** using the file explorer
2. **Use Cursor AI** to regenerate missing files based on imports
3. **Reference the export docs** (COMPLETE_CODE_EXPORT.md) for file contents
4. **Ask for help** with specific file names

---

## 🎉 Done!

Once you've copied all files from this manifest, you'll have a complete working DoorDash BI prototype in Cursor!

**Total Files:** ~60-70 files
**Estimated Time:** 30-60 minutes (manual) OR 5 minutes (using Export feature)

---

**Next Step:** Open [DOWNLOAD_INSTRUCTIONS.md](./DOWNLOAD_INSTRUCTIONS.md) for setup instructions.
