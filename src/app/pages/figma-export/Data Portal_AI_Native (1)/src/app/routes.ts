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