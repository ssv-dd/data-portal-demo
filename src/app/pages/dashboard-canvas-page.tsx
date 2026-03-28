import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/app/lib/motion';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Plus, LayoutDashboard, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription } from '../components/ui/dialog';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { SourceBrowserPanel, SOURCE_TABS } from '../components/panels/source-browser-panel';
import { CanvasTopBar, type DashboardFilter } from '../components/dashboard/canvas-top-bar';
import { CanvasGrid } from '../components/dashboard/canvas-grid';
import type { AIWidgetConfig } from '../components/AIWidgetCreator';
import { canvasStorage } from '../data/canvas-storage';
import { ordersData, revenueData, latencyData, marketShareData } from '../data/mock/dashboard-canvas-data';
import { GradientOrb } from '../components/hero/gradient-orb';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel, radius } from '@/styles/theme';
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
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.large};
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

const PublishModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`;

const PublishInfoBox = styled.div`
  background: rgb(var(--app-muted-rgb) / 0.5);
  border-radius: ${radius.lg};
  padding: ${Theme.usage.space.medium};
`;

const PublishInfoTitle = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const PublishInfoSub = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const ShareUrlContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  background: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${radius.lg};
  padding: ${Theme.usage.space.xSmall} ${Theme.usage.space.small};
`;

const ShareUrlText = styled.input`
  flex: 1;
  border: none;
  background: none;
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.foreground};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  outline: none;
  min-width: 0;
`;

const CopyButton = styled.button<{ $copied: boolean }>`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
  padding: ${Theme.usage.space.xxSmall} ${Theme.usage.space.xSmall};
  border-radius: ${radius.md};
  border: none;
  cursor: pointer;
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  transition: all 150ms;
  background: ${({ $copied }) => $copied ? 'rgb(var(--app-emerald-rgb, 16 185 129) / 0.1)' : 'rgb(var(--app-violet-rgb) / 0.1)'};
  color: ${({ $copied }) => $copied ? colors.emerald500 : colors.violet600};

  &:hover {
    background: ${({ $copied }) => $copied ? 'rgb(var(--app-emerald-rgb, 16 185 129) / 0.15)' : 'rgb(var(--app-violet-rgb) / 0.15)'};
  }
`;

const PublishActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${Theme.usage.space.xSmall};
`;

const StatusPill = styled.span<{ $published: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: ${Theme.usage.fontSize.xxSmall};
  font-weight: 500;
  background: ${({ $published }) => $published ? 'rgb(var(--app-emerald-rgb, 16 185 129) / 0.12)' : 'rgb(var(--app-overlay-rgb) / 0.06)'};
  color: ${({ $published }) => $published ? colors.emerald500 : colors.mutedForeground};
`;

// Mock data generator for new widgets
function generateMockData(chartType: string): { data?: any[]; kpiValue?: string; kpiChange?: string; kpiTrend?: 'up' | 'down' | 'flat' } {
  const datasets = [ordersData, revenueData, latencyData, marketShareData];
  const randomData = datasets[Math.floor(Math.random() * datasets.length)];

  switch (chartType) {
    case 'kpi':
      return { kpiValue: `${Math.floor(Math.random() * 100)}K`, kpiChange: `+${(Math.random() * 10).toFixed(1)}%`, kpiTrend: 'up' };
    case 'donut':
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
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('chat');
  const [maximized, setMaximized] = useState(false);
  const [dashboardFilters, setDashboardFilters] = useState<DashboardFilter[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightWidgetId, setHighlightWidgetId] = useState<string | null>(
    () => searchParams.get('highlight'),
  );

  // Clear highlight param after 2.5s
  useEffect(() => {
    if (!highlightWidgetId) return;
    const timer = setTimeout(() => {
      setHighlightWidgetId(null);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('highlight');
        return next;
      }, { replace: true });
    }, 2500);
    return () => clearTimeout(timer);
  }, [highlightWidgetId, setSearchParams]);

  const handleToggleMaximize = useCallback(() => {
    setMaximized((prev) => {
      if (!prev) {
        // Maximize: collapse both panels
        setLeftPanelOpen(false);
        setRightPanelOpen(false);
      } else {
        // Restore: expand both panels
        setLeftPanelOpen(true);
        setRightPanelOpen(true);
      }
      return !prev;
    });
  }, []);

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
  }, [canvas, updateCanvas]);

  const handleAddChartFromType = useCallback((chartType: WidgetConfig['type']) => {
    if (!canvas) return;
    const mockData = generateMockData(chartType);
    const chartLabels: Record<string, string> = {
      column: 'Column Chart', bar: 'Bar Chart', line: 'Line Chart', area: 'Area Chart', donut: 'Donut Chart', kpi: 'KPI Card',
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
    if (!canvas) return;
    const publishId = crypto.randomUUID().slice(0, 8);
    const url = `${window.location.origin}${window.location.pathname}#/dashboard/${canvas.id}?shared=${publishId}`;
    updateCanvas({ status: 'published' });
    setShareUrl(url);
    setCopied(false);
    setShowPublishModal(true);
  }, [canvas, updateCanvas]);

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareUrl]);

  if (notFound) {
    return (
      <PageContainer>
        <GradientOverlay />
        <ContentLayout>
          <CenterPanel>
            <NotFoundContainer>
              <EmptyIcon />
              <EmptyTitle>Dashboard not found</EmptyTitle>
              <EmptyDescription>
                This dashboard may have been deleted or the link is invalid.
              </EmptyDescription>
              <Button style={{ backgroundColor: colors.violet600, color: colors.white }} onClick={() => navigate('/dashboards')}>
                Back to Dashboards
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
          tabs={SOURCE_TABS.map((t) => ({ key: t.key, label: t.label, icon: t.icon }))}
          activeTab={leftTab}
          onTabChange={(tab) => { setLeftTab(tab); setLeftPanelOpen(true); if (maximized) setMaximized(false); }}
          collapsed={!leftPanelOpen}
          onToggleCollapse={() => { setLeftPanelOpen((prev) => !prev); if (maximized) setMaximized(false); }}
          showSearch={false}
          title="Source"
          tabsOnlyWhenCollapsed
        >
          <SourceBrowserPanel
            activeTab={leftTab as any}
            onTabChange={(tab) => setLeftTab(tab)}
            onAIComplete={handleAddWidget}
          />
        </LeftPanel>

        <CenterPanel>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <CanvasTopBar
              canvas={canvas}
              onUpdate={updateCanvas}
              onAddWidget={() => { setLeftTab('chat'); setLeftPanelOpen(true); }}
              onPublish={handlePublish}
              maximized={maximized}
              onToggleMaximize={handleToggleMaximize}
              dashboardFilters={dashboardFilters}
              onDashboardFiltersChange={setDashboardFilters}
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
                <Button style={{ backgroundColor: colors.violet600, color: colors.white, gap: '8px' }} onClick={() => { setLeftTab('chat'); setLeftPanelOpen(true); }}>
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
                highlightWidgetId={highlightWidgetId ?? undefined}
              />
            )}
          </CanvasArea>
        </CenterPanel>

        <AIAssistantSidebar
          title="Dashboard Assistant"
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
          collapsible
          collapsed={!rightPanelOpen}
          onToggleCollapse={() => { setRightPanelOpen((prev) => !prev); if (maximized) setMaximized(false); }}
        />
      </ContentLayout>

      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal} title="Dashboard Published">
        <DialogContent style={{ maxWidth: '520px' }}>
          <DialogDescription>
            Your dashboard is now published and accessible via a shareable link.
          </DialogDescription>
          <PublishModalBody>
            <PublishInfoBox>
              <PublishInfoTitle>{canvas?.title}</PublishInfoTitle>
              <PublishInfoSub>
                {canvas?.layout.length} widget{canvas?.layout.length !== 1 ? 's' : ''} · {canvas?.domain} · {canvas?.tier}
                <span style={{ marginLeft: '8px' }}>
                  <StatusPill $published>Published</StatusPill>
                </span>
              </PublishInfoSub>
            </PublishInfoBox>

            <div>
              <div style={{ fontSize: Theme.usage.fontSize.xxSmall, fontWeight: 500, color: colors.foreground, marginBottom: Theme.usage.space.xxSmall }}>
                Shareable URL
              </div>
              <ShareUrlContainer>
                <ExternalLink style={{ width: 14, height: 14, color: colors.mutedForeground, flexShrink: 0 }} />
                <ShareUrlText
                  readOnly
                  value={shareUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <CopyButton $copied={copied} onClick={handleCopyUrl}>
                  {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                  {copied ? 'Copied' : 'Copy'}
                </CopyButton>
              </ShareUrlContainer>
            </div>

            <PublishActions>
              <Button variant="outline" onClick={() => setShowPublishModal(false)}>
                Close
              </Button>
              <Button
                style={{ backgroundColor: colors.violet600, color: colors.white }}
                onClick={() => {
                  window.open(shareUrl, '_blank');
                  setShowPublishModal(false);
                }}
              >
                <ExternalLink style={{ width: 14, height: 14 }} />
                Open Link
              </Button>
            </PublishActions>
          </PublishModalBody>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
