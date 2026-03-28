import { createHashRouter } from 'react-router'
import { RootLayout } from './components/layout/root-layout'
import { HomePage } from './pages/home-page'
import { MyCanvasPage } from './pages/my-canvas-page'
import { DashboardCanvasPage } from './pages/dashboard-canvas-page'
import { SQLStudioPage } from './pages/sql-studio-page'
import { NotebooksPage } from './pages/notebooks-page'
import { AIWorkflowsPage } from './pages/ai-workflows-page'

export const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'dashboards', element: <MyCanvasPage /> },
      { path: 'dashboard/:id', element: <DashboardCanvasPage /> },
      { path: 'sql-studio', element: <SQLStudioPage /> },
      { path: 'notebooks', element: <NotebooksPage /> },
      { path: 'ai-workflows', element: <AIWorkflowsPage /> },
    ],
  },
])
