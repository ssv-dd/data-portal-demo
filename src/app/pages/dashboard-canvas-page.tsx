import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/app/lib/motion';
import { useParams, useNavigate } from 'react-router';
import { Plus, BarChart3, LineChart as LineChartIcon, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { MetricsLibraryPanel } from '../components/panels/metrics-library-panel';
import { ChartTypesPanel } from '../components/panels/chart-types-panel';
import { CanvasTopBar } from '../components/dashboard/canvas-top-bar';
import { CanvasGrid } from '../components/dashboard/canvas-grid';
import { AIWidgetCreator } from '../components/AIWidgetCreator';
import type { AIWidgetConfig } from '../components/AIWidgetCreator';
import { canvasStorage } from '../data/canvas-storage';
import { ordersData, revenueData, latencyData, marketShareData } from '../data/mock/dashboard-canvas-data';
import { GradientOrb } from '../components/hero/gradient-orb';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel } from '@/styles/theme';
import type { Canvas, CanvasLayoutItem, WidgetConfig } from '@/types';

const PageContainer = styled.div`
  height: 100%;
  background-color: ${colors.background};
  overflow: hidden;
  position: relative;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgb(var(--app-fuchsia-rgb) / 0.08), transparent 35%),
              radial-gradient(circle at bottom right, rgb(var(--app-blue-rgb) / 0.08), transparent 35%);
`;

const ContentLayout = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  gap: ${Theme.usage.space.xSmall};
  padding: ${Theme.usage.space.xSmall};
`;

const CenterPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${glassPanel}
  border-radius: ${Theme.usage.borderRadius.xLarge};
  border: 1px solid ${colors.border};
`;

const CanvasArea = styled.div`
  flex: 1;
  overflow: auto;
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  padding: ${Theme.usage.space.xLarge};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  text-align: center;
`;

const EmptyIcon = styled(LayoutDashboard)`
  width: 48px;
  height: 48px;
  color: rgb(var(--app-muted-fg-rgb) / 0.4);
  margin-bottom: ${Theme.usage.space.medium};
`;

const EmptyTitle = styled.h3`
  font-size: ${Theme.usage.fontSize.large};
  font-weight: 500;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const EmptyDescription = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.mutedForeground};
  margin-bottom: ${Theme.usage.space.large};
  max-width: 400px;
`;

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: ${Theme.usage.space.xLarge};
`;

// Mock data generator for new widgets
function generateMockData(chartType: string): { data?: any[]; kpiValue?: string; kpiChange?: string; kpiTrend?: 'up' | 'down' | 'flat' } {
  const datasets = [ordersData, revenueData, latencyData, marketShareData];
  const randomData = datasets[Math.floor(Math.random() * datasets.length)];

  switch (chartType) {
    case 'kpi':
      return { kpiValue: `${Math.floor(Math.random() * 100)}K`, kpiChange: `+${(Math.random() * 10).toFixed(1)}%`, kpiTrend: 'up' };
    case 'pie':
      return { data: marketShareData };
    default:
      return { data: randomData };
  }
}

export function DashboardCanvasPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [showWidgetCreator, setShowWidgetCreator] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('metrics');

  // Load canvas from storage
  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    const loaded = canvasStorage.getCanvas(id);
    if (!loaded) { setNotFound(true); return; }
    setCanvas(loaded);
    setWidgets(canvasStorage.getCanvasWidgets(id));
  }, [id]);

  const updateCanvas = useCallback((updates: Partial<Canvas>) => {
    if (!canvas) return;
    const updated = { ...canvas, ...updates, lastEdited: new Date().toISOString() };
    canvasStorage.saveCanvas(updated);
    setCanvas(updated);
  }, [canvas]);

  const handleLayoutChange = useCallback((newLayout: CanvasLayoutItem[]) => {
    if (!canvas) return;
    updateCanvas({ layout: newLayout });
  }, [canvas, updateCanvas]);

  const handleAddWidget = useCallback((config: AIWidgetConfig) => {
    if (!canvas) return;
    const mockData = generateMockData(config.chartType);
    const widget: WidgetConfig = {
      id: canvasStorage.generateId(),
      title: config.title,
      subtitle: config.category || '',
      type: config.chartType as WidgetConfig['type'],
      description: config.description,
      category: config.category,
      metricId: config.metricId,
      ...mockData,
    };

    // Save widget
    canvasStorage.saveCanvasWidget(canvas.id, widget);
    setWidgets((prev) => [...prev, widget]);

    // Add to layout at auto-position
    const layoutItem: CanvasLayoutItem = {
      widgetId: widget.id,
      x: 0,
      y: Infinity, // auto-place at bottom
      w: 6,
      h: widget.type === 'kpi' ? 2 : 4,
    };
    updateCanvas({ layout: [...canvas.layout, layoutItem] });
    setShowWidgetCreator(false);
  }, [canvas, updateCanvas]);

  const handleAddChartFromType = useCallback((chartType: WidgetConfig['type']) => {
    if (!canvas) return;
    const mockData = generateMockData(chartType);
    const chartLabels: Record<string, string> = {
      bar: 'Bar Chart', line: 'Line Chart', area: 'Area Chart', pie: 'Pie Chart', kpi: 'KPI Card',
    };
    const widget: WidgetConfig = {
      id: canvasStorage.generateId(),
      title: chartLabels[chartType] || 'New Widget',
      subtitle: '',
      type: chartType,
      ...mockData,
    };
    canvasStorage.saveCanvasWidget(canvas.id, widget);
    setWidgets((prev) => [...prev, widget]);
    const layoutItem: CanvasLayoutItem = {
      widgetId: widget.id,
      x: 0,
      y: Infinity,
      w: 6,
      h: chartType === 'kpi' ? 2 : 4,
    };
    updateCanvas({ layout: [...canvas.layout, layoutItem] });
  }, [canvas, updateCanvas]);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    if (!canvas) return;
    canvasStorage.removeCanvasWidget(canvas.id, widgetId);
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    updateCanvas({ layout: canvas.layout.filter((l) => l.widgetId !== widgetId) });
  }, [canvas, updateCanvas]);

  const handlePublish = useCallback(() => {
    updateCanvas({ status: canvas?.status === 'published' ? 'draft' : 'published' });
    // Toast notification — uses Prism ToastProvider already wired in App.tsx
    // Import: import { useToast } from '@doordash/prism-react';
    // For simplicity in this prototype, we'll use a basic alert-style approach
    // The Prism toast integration can be added as a follow-up
  }, [canvas, updateCanvas]);

  if (notFound) {
    return (
      <PageContainer>
        <GradientOverlay />
        <ContentLayout>
          <CenterPanel>
            <NotFoundContainer>
              <EmptyIcon />
              <EmptyTitle>Canvas not found</EmptyTitle>
              <EmptyDescription>
                This canvas may have been deleted or the link is invalid.
              </EmptyDescription>
              <Button variant="outline" onClick={() => navigate('/dashboards')}>
                Back to Canvases
              </Button>
            </NotFoundContainer>
          </CenterPanel>
        </ContentLayout>
      </PageContainer>
    );
  }

  if (!canvas) return null;

  return (
    <PageContainer>
      <GradientOverlay />
      <GradientOrb variant="primary" style={{ left: '-120px', top: '-20px' }} />
      <GradientOrb variant="secondary" style={{ right: '-80px', top: '120px' }} />

      <ContentLayout>
        <LeftPanel
          tabs={[
            { key: 'metrics', label: 'Metrics', icon: BarChart3 },
            { key: 'charts', label: 'Charts', icon: LineChartIcon },
          ]}
          activeTab={leftTab}
          onTabChange={setLeftTab}
          collapsed={!leftPanelOpen}
          onToggleCollapse={() => setLeftPanelOpen(!leftPanelOpen)}
          showSearch={true}
          searchPlaceholder={leftTab === 'metrics' ? 'Search metrics...' : 'Search chart types...'}
        >
          {leftTab === 'metrics' ? (
            <MetricsLibraryPanel onMetricAdd={(metric: any) => console.log('Metric add:', metric)} />
          ) : (
            <ChartTypesPanel onChartTypeSelect={handleAddChartFromType} />
          )}
        </LeftPanel>

        <CenterPanel>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <CanvasTopBar
              canvas={canvas}
              onUpdate={updateCanvas}
              onAddWidget={() => setShowWidgetCreator(true)}
              onPublish={handlePublish}
            />
          </motion.div>

          <CanvasArea>
            {canvas.layout.length === 0 ? (
              <EmptyState>
                <EmptyIcon />
                <EmptyTitle>Start building your dashboard</EmptyTitle>
                <EmptyDescription>
                  Add widgets to visualize your metrics. Use the AI assistant to quickly create charts and KPIs.
                </EmptyDescription>
                <Button variant="outline" style={{ gap: '8px' }} onClick={() => setShowWidgetCreator(true)}>
                  <Plus style={{ width: 16, height: 16 }} />
                  Add your first widget
                </Button>
              </EmptyState>
            ) : (
              <CanvasGrid
                layout={canvas.layout}
                widgets={widgets}
                onLayoutChange={handleLayoutChange}
                onRemoveWidget={handleRemoveWidget}
              />
            )}
          </CanvasArea>
        </CenterPanel>

        <AIAssistantSidebar
          title="Canvas Assistant"
          contextLabel="Dashboard aware"
          knowledgeBaseId="dashboards"
          welcomeMessage="I can help you add widgets, rearrange your dashboard, or generate summaries from your metrics."
          suggestions={[
            { text: 'Add a KPI card' },
            { text: 'Generate summary' },
            { text: 'Compare periods' },
            { text: 'Add trend chart' },
          ]}
          suggestedActions={['Add metric', 'Create chart', 'Export to PDF']}
        />
      </ContentLayout>

      <AIWidgetCreator
        open={showWidgetCreator}
        onOpenChange={setShowWidgetCreator}
        onManualCreate={() => { setLeftPanelOpen(true); setLeftTab('metrics'); }}
        onAIComplete={handleAddWidget}
      />
    </PageContainer>
  );
}
