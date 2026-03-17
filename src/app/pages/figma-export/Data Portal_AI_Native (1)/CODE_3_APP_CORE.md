# App Core Files - Complete Source Code

---

## src/app/App.tsx

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

---

## src/app/routes.ts

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

## src/app/components/layout/root-layout.tsx

```tsx
import { Outlet } from 'react-router';
import { TopNav } from './top-nav';
import { useState, useEffect } from 'react';
import { KeyboardShortcutsModal } from '../keyboard-shortcuts-modal';

export function RootLayout() {
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts modal with ?
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-white">
      <TopNav />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <KeyboardShortcutsModal open={showShortcuts} onOpenChange={setShowShortcuts} />
    </div>
  );
}
```

---

## src/app/components/layout/top-nav.tsx

```tsx
import { Link, useLocation, useNavigate } from 'react-router';
import { Bell, User } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const tabs = [
  { name: 'Home', path: '/' },
  { name: 'Dashboards', path: '/my-canvas' },
  { name: 'SQL Studio', path: '/sql-studio' },
  { name: 'Notebooks', path: '/notebooks' },
  { name: 'AI Workflows', path: '/ai-workflows' },
];

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="h-16 border-b border-gray-200 bg-white flex items-center px-6 gap-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF3A00' }}>
          <span className="text-white font-bold text-lg">D</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium" style={{ color: '#1a1a1a' }}>DoorDash</span>
          <span className="text-gray-400">|</span>
          <span className="text-lg text-gray-600">Data Portal</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 flex-1">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-4 py-2 rounded-md transition-colors ${
              isActive(tab.path)
                ? 'text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            style={
              isActive(tab.path)
                ? { backgroundColor: '#FF3A00' }
                : undefined
            }
          >
            {tab.name}
          </Link>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs"
              >
                2
              </Badge>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuItem onClick={() => navigate('/verification/delivery_latency_by_zone')}>
              <div className="flex flex-col gap-1">
                <span className="text-sm">Asset pending verification</span>
                <span className="text-xs text-gray-500">delivery_latency_by_zone.sql</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <span className="text-sm">Dashboard shared with you</span>
                <span className="text-xs text-gray-500">Operations Dashboard by Ops Team</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </nav>
  );
}
```
