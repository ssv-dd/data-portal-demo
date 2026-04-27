import { createHashRouter } from 'react-router'
import { RootLayout } from './components/layout/root-layout'
import { HomePage } from './pages/home-page'
import { ChatsPage } from './pages/chats-page'
import { MyCanvasPage } from './pages/my-canvas-page'
import { DashboardCanvasPage } from './pages/dashboard-canvas-page'
import { SQLStudioPage } from './pages/sql-studio-page'
import { NotebooksPage } from './pages/notebooks-page'
import { AIWorkflowsPage } from './pages/ai-workflows-page'
import { ChartBuilderPage } from './pages/chart-builder-page'
import { NotebookEditorPage } from './pages/notebook-editor-page'

export const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'chats', element: <ChatsPage /> },
      { path: 'dashboards', element: <MyCanvasPage /> },
      { path: 'dashboard/:id', element: <DashboardCanvasPage /> },
      { path: 'chart-builder', element: <ChartBuilderPage /> },
      { path: 'sql-studio', element: <SQLStudioPage /> },
      { path: 'notebooks', element: <NotebooksPage /> },
      { path: 'notebook/:id', element: <NotebookEditorPage /> },
      { path: 'ai-workflows', element: <AIWorkflowsPage /> },
    ],
  },
])
