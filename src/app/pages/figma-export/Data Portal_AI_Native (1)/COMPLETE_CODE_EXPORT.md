# Complete DoorDash BI Prototype Code Export

This file contains ALL the code you need to recreate this project in Cursor.

## 📁 Project Structure

```
doordash-bi-prototype/
├── package.json
├── vite.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── tsconfig.node.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── fonts.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   └── app/
│       ├── App.tsx
│       ├── routes.ts
│       ├── components/
│       ├── context/
│       ├── data/
│       └── pages/
```

---

## 🚀 Quick Setup Instructions

### 1. Create project directory
```bash
mkdir doordash-bi-prototype
cd doordash-bi-prototype
```

### 2. Initialize and install dependencies
```bash
# Copy package.json from below, then run:
npm install
```

### 3. Create all files
Follow the file structure below and copy each file's content.

### 4. Run the app
```bash
npm run dev
```

---

## 📄 Core Configuration Files

See **CODE_EXPORT_CONFIG.md** for all configuration files (package.json, vite.config.ts, etc.)

---

## 🎨 Styles

### src/styles/index.css
```css
@import './fonts.css';
@import './tailwind.css';
@import './theme.css';
```

### src/styles/fonts.css
```css
/* Empty - add Google Fonts or custom fonts here if needed */
```

### src/styles/tailwind.css
```css
@import 'tailwindcss' source(none);
@source '../**/*.{js,ts,jsx,tsx}';

@import 'tw-animate-css';
```

### src/styles/theme.css
See the file `/src/styles/theme.css` in the current project for the complete theme configuration with DoorDash design tokens.

---

## 🔧 App Core Files

### src/app/App.tsx
```tsx
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
```

### src/app/routes.ts
```tsx
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layout/root-layout";
import { HomePage } from "./pages/home-page";
import { AgentPage } from "./pages/agent-page";
import { DashboardCanvasPage } from "./pages/dashboard-canvas-page";
import { SQLStudioPage } from "./pages/sql-studio-page";
import { NotebooksPage } from "./pages/notebooks-page";
import { AIWorkflowsPage } from "./pages/ai-workflows-page";
import { VerificationPage } from "./pages/verification-page";
import { TelemetryPage } from "./pages/telemetry-page";
import { MetricRegistryPage } from "./pages/metric-registry-page";
import { MyCanvasPage } from "./pages/my-canvas-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "my-canvas", Component: MyCanvasPage },
      { path: "agent", Component: AgentPage },
      { path: "dashboard/draft", Component: DashboardCanvasPage },
      { path: "sql-studio", Component: SQLStudioPage },
      { path: "notebooks", Component: NotebooksPage },
      { path: "metric-registry", Component: MetricRegistryPage },
      { path: "ai-workflows", Component: AIWorkflowsPage },
      { path: "verification/:id", Component: VerificationPage },
      { path: "admin/telemetry", Component: TelemetryPage },
    ],
  },
]);
```

---

## 📦 Data & Mock Files

### src/app/data/mock-data.ts
This file contains all the mock data for artifacts, conversations, and telemetry.
See the current `/src/app/data/mock-data.ts` file for the complete data structure.

---

## 🧩 Key Components

### Layout Components

For the complete source code of these components, see the current project files:
- `/src/app/components/layout/root-layout.tsx`
- `/src/app/components/layout/top-nav.tsx`

### Feature Components

Key components you'll need:
- `/src/app/components/ai-assistant-sidebar.tsx` - AI assistant with context-specific suggestions
- `/src/app/components/ai-agent-sidebar.tsx` - Main agent chat interface
- `/src/app/components/dashboard-card.tsx` - Card component for artifacts
- `/src/app/components/verified-badge.tsx` - Verification status badge
- `/src/app/components/confidence-banner.tsx` - Confidence level indicator
- `/src/app/components/keyboard-shortcuts-modal.tsx` - Keyboard shortcuts help

---

## 📄 Page Components

Main application pages:
- `/src/app/pages/home-page.tsx` - Home page with AI chat and discovery
- `/src/app/pages/my-canvas-page.tsx` - Dashboards listing page
- `/src/app/pages/sql-studio-page.tsx` - SQL editor with AI assistant
- `/src/app/pages/notebooks-page.tsx` - Notebooks listing with AI help
- `/src/app/pages/ai-workflows-page.tsx` - AI workflows management
- `/src/app/pages/verification-page.tsx` - Asset verification interface
- `/src/app/pages/telemetry-page.tsx` - Admin telemetry dashboard
- `/src/app/pages/metric-registry-page.tsx` - Metrics catalog
- `/src/app/pages/agent-page.tsx` - Dedicated agent chat page
- `/src/app/pages/dashboard-canvas-page.tsx` - Dashboard editor

---

## 🎨 UI Components (shadcn/ui)

This project uses shadcn/ui components. All UI component files are in `/src/app/components/ui/`.

You have two options:

### Option 1: Copy from current project
Copy all files from `/src/app/components/ui/` in the current Figma Make project.

### Option 2: Use shadcn CLI (recommended for Cursor)
```bash
npx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add card
npx shadcn@latest add separator
npx shadcn@latest add toast
npx shadcn@latest add accordion
# ... add others as needed
```

---

## ⚙️ Important Notes

### DoorDash Branding
Primary color: `#FF3A00`
All branding colors are defined in `theme.css` under CSS custom properties like `--dd-primary`.

### Figma Assets
The home page uses figma:asset imports for images. In Cursor, you'll need to:
1. Remove these imports
2. Replace with your own images or use placeholders
3. Or use the ImageWithFallback component with real URLs

Example replacement:
```tsx
// Replace:
import analysisImage1 from 'figma:asset/d6b9d1d8fdb529e192abe6751b36c052d614bcb5.png';

// With:
const analysisImage1 = 'https://via.placeholder.com/800x400';
// or place images in /public folder:
const analysisImage1 = '/images/analysis1.png';
```

### Monaco Editor
The SQL Studio page uses Monaco Editor. Make sure `@monaco-editor/react` is installed.

### Motion (Framer Motion)
Animations use the `motion` package. Import with:
```tsx
import { motion, AnimatePresence } from 'motion/react';
```

---

## 🎯 Next Steps in Cursor

1. ✅ Set up the basic project structure
2. ✅ Install all dependencies
3. ✅ Copy all configuration files
4. ✅ Copy all component and page files
5. ✅ Replace figma:asset imports with real images
6. 🚀 Run `npm run dev`
7. 🎨 Customize and extend as needed

---

## 📚 Additional Resources

- React Router Docs: https://reactrouter.com
- Tailwind CSS v4: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com
- Recharts: https://recharts.org
- Monaco Editor React: https://github.com/suren-atoyan/monaco-react

---

## 💡 Tips for Development in Cursor

1. **Use Cursor's AI Features**: Ask Cursor AI to help refactor or extend components
2. **Add TypeScript Types**: Cursor can help generate proper types for your data
3. **Real Backend Integration**: Replace mock data with real API calls
4. **State Management**: Consider adding Zustand or Redux if needed
5. **Testing**: Add Jest and React Testing Library for component tests
6. **Deployment**: Use Vercel or Netlify for easy deployment

---

## 📧 Support

If you need the complete source code for any specific file, please check the individual export files:
- CODE_EXPORT_CONFIG.md - Configuration files
- Other export files contain specific components and pages

You can also use Cursor's AI to help recreate any missing files based on the imports and structure shown here.
