import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeInUp } from '@/app/lib/motion';
import { Button } from '../components/ui/button';
import { Share2, Settings, Eye, Plus, GripVertical, MoreVertical, TrendingUp, TrendingDown, Minus, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogDescription } from '../components/ui/dialog';
import { AIAssistantSidebar } from '../components/ai-assistant-sidebar';
import { LeftPanel } from '../components/layout/left-panel';
import { MetricsLibraryPanel } from '../components/panels/metrics-library-panel';
import { COLORS, widgets } from '../data/mock/dashboard-canvas-data';
import type { WidgetConfig } from '@/types';
import { AIWidgetCreator } from '../components/AIWidgetCreator';
import type { AIWidgetConfig } from '../components/AIWidgetCreator';
import { GradientOrb } from '../components/hero/gradient-orb';
import { Theme } from '@doordash/prism-react';
import { colors, glassPanel } from '@/styles/theme';

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

const CanvasToolbar = styled.div`
  border-bottom: 1px solid ${colors.border};
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.xLarge};
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ToolbarTitle = styled.h1`
  font-size: ${Theme.usage.fontSize.xLarge};
  color: ${colors.slate900};
`;

const ToolbarSubtitle = styled.p`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.slate600};
`;

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
`;

const CanvasArea = styled.div`
  flex: 1;
  overflow: auto;
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  padding: ${Theme.usage.space.xLarge};
`;

const CanvasGrid = styled(motion.div)`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${Theme.usage.space.medium};
`;

const GripIcon = styled(GripVertical)`
  width: 16px;
  height: 16px;
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
  opacity: 0;
  transition: opacity 200ms;
  cursor: grab;
  flex-shrink: 0;
`;

const MoreButton = styled.button`
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
  opacity: 0;
  transition: opacity 200ms;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${colors.mutedForeground};
  }
`;

const WidgetContainer = styled.div`
  background-color: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: ${Theme.usage.borderRadius.xLarge};
  overflow: hidden;
  height: 100%;

  &:hover ${GripIcon},
  &:hover ${MoreButton} {
    opacity: 1;
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${Theme.usage.space.medium} ${Theme.usage.space.medium} ${Theme.usage.space.xSmall};
`;

const WidgetTitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xSmall};
  min-width: 0;
`;

const WidgetTitleText = styled.div`
  min-width: 0;
`;

const WidgetTitle = styled.h4`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${colors.slate900};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const WidgetSubtitle = styled.p`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.slate600};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const KpiContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

const KpiValue = styled.div`
  font-size: ${Theme.usage.fontSize.xxxLarge};
  font-weight: 700;
  color: ${colors.foreground};
  margin-bottom: ${Theme.usage.space.xSmall};
`;

const KpiTrendRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${Theme.usage.space.xxSmall};
`;

const KpiChange = styled.span<{ $isFlat: boolean }>`
  font-size: ${Theme.usage.fontSize.xSmall};
  font-weight: 500;
  color: ${({ $isFlat }) => $isFlat ? colors.mutedForeground : colors.green600};
`;

const KpiPeriod = styled.span`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: rgb(var(--app-muted-fg-rgb) / 0.6);
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${Theme.usage.space.medium};
`;

const ModalInfoBox = styled.div`
  background-color: rgb(var(--app-muted-rgb) / 0.5);
  border-radius: ${Theme.usage.borderRadius.xLarge};
  padding: ${Theme.usage.space.medium};
`;

const ModalInfoTitle = styled.div`
  font-size: ${Theme.usage.fontSize.xSmall};
  color: ${colors.foreground};
  font-weight: 500;
  margin-bottom: ${Theme.usage.space.xxSmall};
`;

const ModalInfoSub = styled.div`
  font-size: ${Theme.usage.fontSize.xxSmall};
  color: ${colors.mutedForeground};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${Theme.usage.space.xSmall};
`;

export function DashboardCanvasPage() {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showWidgetCreator, setShowWidgetCreator] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [leftTab, setLeftTab] = useState('metrics');

  const handleMetricAdd = (metric: any) => {
    console.log('Adding metric:', metric);
  };

  const handleManualCreate = () => {
    setLeftPanelOpen(true);
    setLeftTab('metrics');
  };

  const handleAIWidgetComplete = (config: AIWidgetConfig) => {
    console.log('AI widget created:', config);
  };

  const renderChart = (widget: WidgetConfig) => {
    switch (widget.type) {
      case 'kpi':
        return (
          <KpiContainer>
            <KpiValue>{widget.kpiValue}</KpiValue>
            <KpiTrendRow>
              {widget.kpiTrend === 'up' && <TrendingUp style={{ width: '16px', height: '16px', color: colors.green600 }} />}
              {widget.kpiTrend === 'down' && <TrendingDown style={{ width: '16px', height: '16px', color: colors.green600 }} />}
              {widget.kpiTrend === 'flat' && <Minus style={{ width: '16px', height: '16px', color: 'rgb(var(--app-muted-fg-rgb) / 0.6)' }} />}
              <KpiChange $isFlat={widget.kpiTrend === 'flat'}>
                {widget.kpiChange}
              </KpiChange>
              <KpiPeriod>vs prev period</KpiPeriod>
            </KpiTrendRow>
          </KpiContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={widget.data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Bar dataKey="value" fill="var(--dd-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={widget.data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Line type="monotone" dataKey="value" stroke="var(--dd-primary)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={widget.data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--dd-primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--dd-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Area type="monotone" dataKey="value" stroke="var(--dd-primary)" strokeWidth={2} fill="url(#areaGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={widget.data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {widget.data!.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

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
        searchPlaceholder="Search metrics..."
      >
        <MetricsLibraryPanel onMetricAdd={handleMetricAdd} />
      </LeftPanel>

      <CenterPanel>
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <CanvasToolbar>
            <ToolbarRow>
              <div>
                <ToolbarTitle>Q1 Operations Dashboard</ToolbarTitle>
                <ToolbarSubtitle>Last edited 2 hours ago · 8 widgets</ToolbarSubtitle>
              </div>
              <ToolbarActions>
                <Button variant="outline" style={{ gap: '8px', fontSize: '14px' }} onClick={() => setShowWidgetCreator(true)}>
                  <Plus style={{ width: '16px', height: '16px' }} />
                  Add Widget
                </Button>
                <Button variant="outline" style={{ gap: '8px', fontSize: '14px' }}>
                  <Eye style={{ width: '16px', height: '16px' }} />
                  Preview
                </Button>
                <Button variant="outline" style={{ gap: '8px', fontSize: '14px' }}>
                  <Settings style={{ width: '16px', height: '16px' }} />
                  Settings
                </Button>
                <Button
                  style={{ backgroundColor: colors.ddPrimary, color: colors.white, gap: '8px', fontSize: '14px' }}
                  onClick={() => setShowPublishModal(true)}
                >
                  <Share2 style={{ width: '16px', height: '16px' }} />
                  Publish
                </Button>
              </ToolbarActions>
            </ToolbarRow>
          </CanvasToolbar>
        </motion.div>

        <CanvasArea>
          <CanvasGrid variants={staggerContainer} initial="hidden" animate="visible">
            {widgets.map((widget) => (
              <motion.div
                key={widget.id}
                variants={staggerItem}
                style={{ gridColumn: widget.span === 2 ? 'span 2' : 'span 1' }}
              >
                <WidgetContainer>
                  <WidgetHeader>
                    <WidgetTitleArea>
                      <GripIcon />
                      <WidgetTitleText>
                        <WidgetTitle>{widget.title}</WidgetTitle>
                        <WidgetSubtitle>{widget.subtitle}</WidgetSubtitle>
                      </WidgetTitleText>
                    </WidgetTitleArea>
                    <MoreButton>
                      <MoreVertical style={{ width: '16px', height: '16px' }} />
                    </MoreButton>
                  </WidgetHeader>
                  <div style={{
                    padding: widget.type === 'kpi' ? '0 16px 16px' : '0 8px 12px',
                    height: widget.type === 'kpi' ? '96px' : '192px',
                  }}>
                    {renderChart(widget)}
                  </div>
                </WidgetContainer>
              </motion.div>
            ))}
          </CanvasGrid>
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
        onManualCreate={handleManualCreate}
        onAIComplete={handleAIWidgetComplete}
      />

      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal} title="Publish Dashboard">
        <DialogContent style={{ maxWidth: '512px' }}>
            <DialogDescription>
              Share this dashboard with your organization. Verified metrics will power automated narrative summaries.
            </DialogDescription>
          <ModalBody>
            <ModalInfoBox>
              <ModalInfoTitle>Q1 Operations Dashboard</ModalInfoTitle>
              <ModalInfoSub>8 widgets · 4 verified metrics</ModalInfoSub>
            </ModalInfoBox>
            <ModalActions>
              <Button variant="outline" onClick={() => setShowPublishModal(false)}>
                Save as Draft
              </Button>
              <Button
                style={{ backgroundColor: colors.ddPrimary, color: colors.white }}
                onClick={() => setShowPublishModal(false)}
              >
                Publish Now
              </Button>
            </ModalActions>
          </ModalBody>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
